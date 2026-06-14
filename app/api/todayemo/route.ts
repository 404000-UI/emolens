import { Emo } from "@/store/store";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id: string | null = searchParams.get("id");
  const emoji: string | null = searchParams.get("emoji");
  const content: string | null = searchParams.get("content");

  if (id != null && emoji != null && content != null) {
    const apiKey: string = process.env.API_KEY!;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });
    const prompt = `You are a strict data generation engine for a diary emotion analysis system.

Your ONLY task is to analyze the user's diary and emoji and return a JSON object.

---

## 🚨 HARD RULES (must follow)
- Output ONLY valid JSON
- Absolutely NO markdown (no \`\`\` or \`\`\`json)
- Absolutely NO explanations
- Absolutely NO extra text before or after JSON
- The response must start with "{" and end with "}"
- Do NOT wrap the output in code blocks
- Do NOT add any additional keys beyond the schema

If you fail to follow these rules, the response is invalid.

---

## 📦 OUTPUT SCHEMA (STRICT)
{
  "score": number,
  "aiInsight": string
}

---

## 📊 SCORE RULES
- Integer only (0–100)
- 0 = very negative mood
- 100 = extremely positive mood

---

## 🧠 AI INSIGHT RULES
- Must be written in English
- 1–3 sentences
- Must be natural and empathetic
- Do not mention “analysis” or “AI”

---

## 📥 INPUT
Emoji: {${emoji}}
Diary: {${content}}

---

## 🚨 FINAL REMINDER
Return ONLY raw JSON. No exceptions.`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();

    let json;

    try {
      json = JSON.parse(text);
    } catch (e) {
      json = {
        score: 0,
        aiInsight: "분석 실패",
      };
    }

    const res: Emo = {
      id: Number.parseInt(id),
      emoji: emoji,
      content: content,
      score: Number.parseInt(json.score),
      aiInsight: json.aiInsight.toString(),
    };
    return NextResponse.json(res);
  } else {
    return NextResponse.json({
      score: 0,
      aiInsight: "분석 실패",
    });
  }
}
