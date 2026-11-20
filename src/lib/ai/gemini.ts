import { AISearchResponseSchema } from './schemas';
import {
  SEARCH_PARSE_PROMPT,
  COMPARE_PROMPT,
  LISTING_PROMPT,
  FOLLOW_UP_PROMPT,
} from './prompts';
import type {
  AIProvider,
  ParsedSearch,
  ComparisonResult,
  ListingContent,
} from './provider';

function getKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  return key;
}

function getModel() {
  return process.env.GEMINI_MODEL || 'gemini-3.8-flash';
}

function getEmbeddingModel() {
  return process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
}

function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) return braceMatch[0];
  return text.trim();
}

async function generateContent(
  prompt: string,
  temperature: number,
  maxOutputTokens: number
): Promise<string> {
  const model = getModel();
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${getKey()}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export class GeminiProvider implements AIProvider {
  async parseSearchQuery(query: string): Promise<ParsedSearch> {
    const prompt = SEARCH_PARSE_PROMPT + query;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      const fullPrompt =
        attempt === 0
          ? prompt
          : `${prompt}\n\nYour previous response had a validation error: ${lastError?.message}\nPlease fix the JSON and try again.`;

      const text = await generateContent(fullPrompt, 0.1, 1024);
      const jsonStr = extractJSON(text);

      try {
        const parsed = JSON.parse(jsonStr);
        const validated = AISearchResponseSchema.parse(parsed);
        return {
          filters: validated.filters,
          reasoning: validated.reasoning,
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    return {
      filters: { freeTextIntent: query },
      reasoning: 'AI parsing failed — falling back to keyword search',
    };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const model = getEmbeddingModel();
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:embedContent?key=${getKey()}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${model}`,
        content: { parts: [{ text }] },
        outputDimensionality: 768,
      }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.embedding?.values ?? [];
  }

  async compareProperties(
    properties: Record<string, unknown>[]
  ): Promise<ComparisonResult> {
    const prompt = COMPARE_PROMPT + JSON.stringify(properties, null, 2);
    const text = await generateContent(prompt, 0.3, 2048);
    const jsonStr = extractJSON(text);
    return JSON.parse(jsonStr) as ComparisonResult;
  }

  async generateListing(
    details: Record<string, unknown>,
    photoDescriptions?: string[]
  ): Promise<ListingContent> {
    let prompt = LISTING_PROMPT + JSON.stringify(details, null, 2);
    if (photoDescriptions?.length) {
      prompt += '\n\nPHOTO DESCRIPTIONS:\n' + photoDescriptions.join('\n');
    }

    const text = await generateContent(prompt, 0.5, 2048);
    const jsonStr = extractJSON(text);
    return JSON.parse(jsonStr) as ListingContent;
  }

  async generateFollowUp(
    lead: Record<string, unknown>,
    property: Record<string, unknown>
  ): Promise<string> {
    const prompt =
      FOLLOW_UP_PROMPT +
      JSON.stringify({ lead, property }, null, 2);

    const text = await generateContent(prompt, 0.6, 512);
    return text.trim();
  }
}
