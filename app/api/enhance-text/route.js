// app/api/enhance-text/route.js
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { text, context } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer. Enhance the given text to be more professional, impactful, and ATS-friendly while maintaining truthfulness and clarity."
        },
        {
          role: "user",
          content: `${context}\nOriginal text: ${text}\n\nPlease enhance this text to be more professional and ATS-friendly while maintaining its core message.`
        }
      ],
    });

    return NextResponse.json({
      enhancedText: completion.choices[0].message.content.trim()
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance text' },
      { status: 500 }
    );
  }
}