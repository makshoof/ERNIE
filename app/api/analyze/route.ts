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

    // Call Novita API using OpenAI SDK with vision-language model
    // Using ERNIE-4.5-VL-28B-A3B-Thinking - best for detailed industrial analysis with reasoning
    // Alternative: 'baidu-ernie-4.5-vl-424b-a47b' for maximum quality (larger model)
    const response = await openai.chat.completions.create({
      model: 'baidu/ernie-4.5-vl-28b-a3b-thinking',
      messages: [
        {
          role: 'system',
          content: 'You are an expert industrial inspection assistant.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image and answer the user's question: "${question}". 

Please provide:
1. A clear analysis of what you see in the image
2. Identification of any issues, risks, or concerns
3. Simple, actionable suggestions for improvement or correction

Be concise but thorough, focusing on practical insights that can help with industrial safety and maintenance.`,
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
      max_tokens: 32000,
      temperature: 0.7,
    });

    const analysis = response.choices[0]?.message?.content || 'No analysis available';

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

