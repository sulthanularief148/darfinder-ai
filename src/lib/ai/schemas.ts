import { z } from 'zod';

export const AISearchFilterSchema = z.object({
  purpose: z.enum(['rent', 'sale']).optional(),
  propertyType: z.enum(['apartment', 'villa', 'townhouse']).optional(),
  minBedrooms: z.number().int().min(0).max(10).optional(),
  maxBedrooms: z.number().int().min(0).max(10).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  areas: z.array(z.string()).optional(),
  nearMetro: z.boolean().optional(),
  petFriendly: z.boolean().optional(),
  furnished: z.boolean().optional(),
  amenities: z.array(z.string()).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'relevance']).optional(),
  freeTextIntent: z.string().optional(),
});

export const AISearchResponseSchema = z.object({
  filters: AISearchFilterSchema,
  reasoning: z.string(),
});

export type AISearchFilter = z.infer<typeof AISearchFilterSchema>;
export type AISearchResponse = z.infer<typeof AISearchResponseSchema>;
