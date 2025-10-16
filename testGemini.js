import fetch from 'node-fetch';
import 'dotenv/config';

async function testGemini() {
  const prompt = "Hi, say hello in a friendly way.";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  const data = await res.json();
  console.log('Gemini API response:', data);
}

testGemini();
