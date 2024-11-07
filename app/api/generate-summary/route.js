// app/api/generate-summary/route.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { name, jobTitle, workExperience, skills, goals } = await req.json();

    const prompt = `Create a professional CV summary for a person with the following details:
    Name: ${name}
    Job Title: ${jobTitle}
    Work Experience: ${workExperience}
    Key Skills: ${skills}
    Professional Goals: ${goals}

    Write a compelling, concise professional summary (3-4 sentences) that highlights their experience, skills, and goals in a way that would be appropriate for a CV or resume. Use powerful action words and maintain a professional tone.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 200,
    });

    const summary = completion.choices[0].message.content;

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Error generating summary' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
