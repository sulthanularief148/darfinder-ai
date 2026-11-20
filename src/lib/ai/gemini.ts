import { GoogleGenAI } from '@google/genai';
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

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  return new GoogleGenAI({ apiKey: key });
}

function getModel() {
  return process.env.GEMINI_MODEL || 'gemini-2.0-flash';
}

function getEmbeddingModel() {
  return process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';
}

function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) return braceMatch[0];
  return text.trim();
}

export class GeminiProvider implements AIProvider {
  async parseSearchQuery(query: string): Promise<ParsedSearch> {
    const client = getClient();
    const prompt = SEARCH_PARSE_PROMPT + query;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      const fullPrompt =
        attempt === 0
          ? prompt
          : `${prompt}\n\nYour previous response had a validation error: ${lastError?.message}\nPlease fix the JSON and try again.`;

      const response = await client.models.generateContent({
        model: getModel(),
        contents: fullPrompt,
        config: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        },
      });

      const text = response.text ?? '';
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
    const client = getClient();

    const response = await client.models.embedContent({
      model: getEmbeddingModel(),
      contents: text,
    });

    return response.embeddings?.[0]?.values ?? [];
  }

  async compareProperties(
    properties: Record<string, unknown>[]
  ): Promise<ComparisonResult> {
    const client = getClient();
    const prompt = COMPARE_PROMPT + JSON.stringify(properties, null, 2);

    const response = await client.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: { temperature: 0.3, maxOutputTokens: 2048 },
    });

    const text = response.text ?? '';
    const jsonStr = extractJSON(text);
    return JSON.parse(jsonStr) as ComparisonResult;
  }

  async generateListing(
    details: Record<string, unknown>,
    photoDescriptions?: string[]
  ): Promise<ListingContent> {
    const client = getClient();
    let prompt = LISTING_PROMPT + JSON.stringify(details, null, 2);
    if (photoDescriptions?.length) {
      prompt += '\n\nPHOTO DESCRIPTIONS:\n' + photoDescriptions.join('\n');
    }

    const response = await client.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: { temperature: 0.5, maxOutputTokens: 2048 },
    });

    const text = response.text ?? '';
    const jsonStr = extractJSON(text);
    return JSON.parse(jsonStr) as ListingContent;
  }

  async generateFollowUp(
    lead: Record<string, unknown>,
    property: Record<string, unknown>
  ): Promise<string> {
    const client = getClient();
    const prompt =
      FOLLOW_UP_PROMPT +
      JSON.stringify({ lead, property }, null, 2);

    const response = await client.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: { temperature: 0.6, maxOutputTokens: 512 },
    });

    return response.text?.trim() ?? '';
  }
}
