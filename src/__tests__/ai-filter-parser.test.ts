import { describe, it, expect } from 'vitest';
import { AISearchResponseSchema, AISearchFilterSchema } from '@/lib/ai/schemas';

describe('AI Search Filter Schema', () => {
  it('validates a complete filter set', () => {
    const result = AISearchFilterSchema.safeParse({
      purpose: 'rent',
      propertyType: 'apartment',
      minBedrooms: 2,
      maxBedrooms: 3,
      minPrice: 50000,
      maxPrice: 120000,
      areas: ['Dubai Marina', 'JVC'],
      nearMetro: true,
      petFriendly: false,
      furnished: true,
      freeTextIntent: 'family apartment near beach',
    });
    expect(result.success).toBe(true);
  });

  it('validates minimal filters', () => {
    const result = AISearchFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejects invalid purpose', () => {
    const result = AISearchFilterSchema.safeParse({ purpose: 'lease' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid property type', () => {
    const result = AISearchFilterSchema.safeParse({ propertyType: 'mansion' });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = AISearchFilterSchema.safeParse({ minPrice: -1000 });
    expect(result.success).toBe(false);
  });

  it('rejects bedroom count over 10', () => {
    const result = AISearchFilterSchema.safeParse({ minBedrooms: 15 });
    expect(result.success).toBe(false);
  });

  it('validates full AI response with reasoning', () => {
    const result = AISearchResponseSchema.safeParse({
      filters: {
        purpose: 'sale',
        propertyType: 'villa',
        minPrice: 2000000,
        areas: ['Arabian Ranches'],
      },
      reasoning: 'User wants to buy a luxury villa in Arabian Ranches',
    });
    expect(result.success).toBe(true);
  });

  it('rejects AI response without reasoning', () => {
    const result = AISearchResponseSchema.safeParse({
      filters: { purpose: 'rent' },
    });
    expect(result.success).toBe(false);
  });
});
