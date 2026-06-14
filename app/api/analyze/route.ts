import { Emo, Insight } from "@/store/store";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const infoText = searchParams.get("info");

  if (!infoText) return;

  const apiKey: string = process.env.API_KEY!;

  const info: Credential = JSON.parse(infoText);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite",
  });
  const prompt = `You are a strict JSON generation engine for a diary emotion analysis system.

Your ONLY task is to analyze the user's emotion history and return a JSON object.

---

## 🚨 HARD RULES
- Output ONLY valid JSON
- NO markdown (no \`\`\` or \`\`\`json)
- NO explanations
- NO extra text before or after JSON
- Must start with "{" and end with "}"
- Do NOT add extra keys

---

## 📦 OUTPUT SCHEMA (STRICT)
{
  "urgent": string,
  "positive": string,
  "corelative": string
}

---

## 🧠 FIELD RULES
- urgent: critical emotional issues or concerns
- positive: positive patterns or good emotional signals
- corelative: relationships or connections between emotions over time

All values must be written in English.
Each field must be 1 sentence, Under 10 words.

---

## 📥 INPUT (JSON)
Analyze the following data:
${JSON.stringify(info)}

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

  const res: Insight = {
    urgent: json.urgent.toString(),
    positive: json.positive.toString(),
    corelative: json.corelative.toString(),
  };
  return NextResponse.json(res);
}
