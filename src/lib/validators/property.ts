import { z } from 'zod';
import { DUBAI_AREAS } from '@/types';

export const PropertyFilterSchema = z.object({
  purpose: z.enum(['rent', 'sale']).optional(),
  type: z.enum(['apartment', 'villa', 'townhouse']).optional(),
  area: z.enum(DUBAI_AREAS as unknown as [string, ...string[]]).optional(),
  bedrooms_min: z.coerce.number().int().min(0).max(10).optional(),
  bedrooms_max: z.coerce.number().int().min(0).max(10).optional(),
  price_min: z.coerce.number().min(0).optional(),
  price_max: z.coerce.number().min(0).optional(),
  furnished: z.coerce.boolean().optional(),
  pet_friendly: z.coerce.boolean().optional(),
  near_metro: z.coerce.boolean().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'oldest']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  q: z.string().max(200).optional(),
});

export type PropertyFilter = z.infer<typeof PropertyFilterSchema>;
