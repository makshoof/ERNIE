import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const question = formData.get('question') as string;

    if (!image || !question) {
      return NextResponse.json(
        { error: 'Image and question are required' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.NOVITA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NOVITA_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client with Novita.ai endpoint
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.novita.ai/openai'
    });

    // Convert image to base64
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const imageDataUrl = `data:${image.type};base64,${base64Image}`;

    // Log the question for debugging
    console.log('User question:', question);

    // Call Novita API using OpenAI SDK with vision-language model
    const response = await openai.chat.completions.create({
      model: 'baidu/ernie-4.5-vl-28b-a3b-thinking',
      messages: [
        {
          role: 'system',
          content: 'Answer questions directly. Do not provide general analysis unless asked.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please answer this question about the image: "${question}"

IMPORTANT: Only answer the question. Do not provide a general description or analysis of the image.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
                detail: 'high' as const,
              },
            },
          ] as Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string; detail: 'high' } }>,
        },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const analysis = response.choices[0]?.message?.content || 'No response available';
    
    // Log the response for debugging
    console.log('AI Response length:', analysis.length);
    console.log('AI Response preview:', analysis.substring(0, 200));

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    console.error('Error status:', error?.status);
    console.error('Error code:', error?.code);
    console.error('Error type:', error?.type);
    console.error('Error param:', error?.param);
    
    let errorMessage = 'Unknown error';
    
    // Safely extract error message
    if (error?.message) {
      errorMessage = String(error.message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // OpenAI SDK errors have error property
    if (error?.error) {
      console.error('API Error details:', error.error);
      try {
        errorMessage = `${errorMessage} - ${JSON.stringify(error.error)}`;
      } catch {
        errorMessage = `${errorMessage} - ${String(error.error)}`;
      }
    }
    
    // Handle OpenAI SDK errors
    if (error?.status) {
      errorMessage = `API Error (${error.status}): ${errorMessage}`;
    }
    if (error?.code) {
      errorMessage = `${errorMessage} (Code: ${error.code})`;
    }
    if (error?.param) {
      errorMessage = `${errorMessage} (Param: ${error.param})`;
    }
    
    // Always return JSON response
    try {
      return NextResponse.json(
        { 
          error: 'Internal server error', 
          details: errorMessage,
          errorInfo: process.env.NODE_ENV === 'development' ? {
            status: error?.status,
            code: error?.code,
            type: error?.type,
            param: error?.param,
            error: error?.error
          } : undefined
        },
        { 
          status: error?.status || 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (jsonError) {
      // Fallback if JSON.stringify fails
      return NextResponse.json(
        { error: 'Internal server error', details: 'An unexpected error occurred' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}

