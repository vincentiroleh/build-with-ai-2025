import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(userQuestion) {
  // Load FAQ context
  const data = JSON.parse(await fs.promises.readFile('./moztra-faq.json', 'utf-8'));

  let prompt = `${data.context}\n\nHere are some examples:\n`;
  for (const pair of data.examples) {
    prompt += `Q: ${pair.question}\nA: ${pair.answer}\n\n`;
  }
  prompt += `Now answer this question:\n"${userQuestion}"`;

  // Send to Gemini
  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: prompt,
  });

  const response = result.text;

  // ✅ Log question & response to a file
  const logEntry = {
    time: new Date().toISOString(),
    question: userQuestion,
    response: response.trim(),
  };

  const logPath = path.resolve('./logs.json');

  // Append to file, or create if it doesn't exist
  fs.appendFile(logPath, JSON.stringify(logEntry) + ',\n', (err) => {
    if (err) console.error('Failed to log chat:', err.message);
  });

  return response;
}
