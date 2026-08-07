import { GoogleGenAI } from '@google/genai';

// Bài 33 — AI for JavaScript: one place that owns the Gemini client.
//
// Everything that talks to Gemini (the aiService in Bài 35 and the CLI reviewer
// in scripts/ai-review.ts) imports from here, so the model name and the API key
// handling live in exactly one file.

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

// The key is read lazily: importing this module must not crash a dev machine that
// has no GEMINI_API_KEY, only actually *calling* Gemini should fail.
let client: GoogleGenAI | null = null;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function getGeminiClient(): GoogleGenAI {
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not set — copy .env.example to .env and fill it in');
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }
  return client;
}

// Exported for tests so a fake client can be injected / the singleton reset.
export function __resetGeminiClient(): void {
  client = null;
}
