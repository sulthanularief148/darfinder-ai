import type { SearchFilters } from '@/types';

export interface ParsedSearch {
  filters: SearchFilters;
  reasoning: string;
}

export interface ComparisonResult {
  summary: string;
  winner: string | null;
  highlights: { propertyId: string; pros: string[]; cons: string[] }[];
}

export interface ListingContent {
  title: string;
  description_en: string;
  description_ar: string;
  highlights: string[];
}

export interface AIProvider {
  parseSearchQuery(query: string): Promise<ParsedSearch>;
  generateEmbedding(text: string): Promise<number[]>;
  compareProperties(properties: Record<string, unknown>[]): Promise<ComparisonResult>;
  generateListing(details: Record<string, unknown>, photoDescriptions?: string[]): Promise<ListingContent>;
  generateFollowUp(lead: Record<string, unknown>, property: Record<string, unknown>): Promise<string>;
}

let provider: AIProvider | null = null;

export async function getAIProvider(): Promise<AIProvider> {
  if (provider) return provider;

  const { GeminiProvider } = await import('./gemini');
  provider = new GeminiProvider();
  return provider;
}
