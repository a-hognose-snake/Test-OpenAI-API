import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!, // Use the API key from environment variables
});

export async function POST(request: NextRequest) {
    // Check if the request has a valid JSON body
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 }); // Return an error if content type is not JSON
    }

    try {
        // Parse the JSON body to extract the 'query' property
        const requestBody = await request.json();
        const { query } = requestBody;

        // Check if query is present
        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 }); // Return an error if query is missing
        }

        // Use the OpenAI client to get a completion
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: query }], // Pass the query as the user's message
            model: "gpt-3.5-turbo", // Specify the model to use
        });

        // Return the completion's response
        return NextResponse.json({ response: chatCompletion.choices[0].message.content });

    } catch (error) {
        console.error('Error processing request:', error); // Log any errors
        return NextResponse.json({ error: 'Invalid JSON data or OpenAI API error' }, { status: 500 }); // Return a server error for any other issues
    }
}
