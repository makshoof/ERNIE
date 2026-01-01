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

    // Convert File to base64 data URL
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageDataUrl = `data:${image.type};base64,${buffer.toString('base64')}`;

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

    // Call ERNIE model for image question answering
    const response = await openai.chat.completions.create({
      model: 'baidu/ernie-4.5-vl-28b-a3b',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert image inspector. Analyze the given image in detail based on the user question. Include: 1) Observations, 2) Potential safety issues, 3) Recommendations, 4) Any other relevant info. Provide a full, structured answer.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Question: ${question}
      
      Provide a detailed analysis using information from the image. Highlight all relevant points, safety concerns, and observations.`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
                detail: 'high' as const
              }
            }
          ]
        }
      ],
      
      max_tokens: 1000,
      temperature: 0.7
    });

    const analysis = response.choices[0]?.message?.content || 'No response available';

    console.log('AI Response length:', analysis.length);
    console.log('AI Response preview:', analysis.substring(0, 200));

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Error analyzing image:', error);

    let errorMessage = 'Unknown error';
    let statusCode = 500;

    if (error?.status === 429) {
      errorMessage =
        'API rate limit exceeded. Please wait a few minutes and try again. You may have reached your API usage limit for this period.';
      statusCode = 429;
    } else if (error?.status === 401) {
      errorMessage = 'API authentication failed. Please check your API key.';
      statusCode = 401;
    } else if (error?.status === 403) {
      errorMessage = 'API access forbidden. Please check your API key permissions.';
      statusCode = 403;
    } else {
      if (error?.message) errorMessage = String(error.message);
      if (error?.error) errorMessage += ` - ${JSON.stringify(error.error)}`;
      if (error?.status) {
        errorMessage = `API Error (${error.status}): ${errorMessage}`;
        statusCode = error.status;
      }
      if (error?.code) errorMessage += ` (Code: ${error.code})`;
      if (error?.param) errorMessage += ` (Param: ${error.param})`;
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: errorMessage,
        errorInfo:
          process.env.NODE_ENV === 'development'
            ? {
                status: error?.status,
                code: error?.code,
                type: error?.type,
                param: error?.param,
                error: error?.error
              }
            : undefined
      },
      {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
