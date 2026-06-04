import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ParsedUtteranceItem } from "./parse-fallback";

const SYSTEM = `You parse kirana shopkeeper speech in Hindi, English, or Hinglish.
Return ONLY valid JSON array. Each item: { "spoken": string, "action": "sold"|"out_of_stock"|"restock", "quantity": number optional }
Examples:
"Aaj 12 Parle-G bik gaye" -> [{"spoken":"parle g","action":"sold","quantity":12}]
"dahi khatam ho gaya" -> [{"spoken":"dahi","action":"out_of_stock"}]`;

export async function parseWithGemini(
  transcript: string,
  apiKey: string
): Promise<ParsedUtteranceItem[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM,
  });

  const result = await model.generateContent(
    `Transcript: "${transcript}"\nJSON array:`
  );
  const text = result.response.text();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("No JSON in Gemini response");

  const parsed = JSON.parse(jsonMatch[0]) as ParsedUtteranceItem[];
  return parsed.filter((p) => p.spoken && p.action);
}
