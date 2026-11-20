import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const CreatePropertySchema = z.object({
  title: z.string().min(5).max(200),
  type: z.enum(['apartment', 'villa', 'townhouse']),
  purpose: z.enum(['rent', 'sale']),
  price_aed: z.number().min(0),
  bedrooms: z.number().int().min(0).max(10),
  bathrooms: z.number().int().min(1).max(10),
  size_sqft: z.number().min(100).max(100000),
  area: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  furnished: z.boolean().optional().default(false),
  pet_friendly: z.boolean().optional().default(false),
  near_metro: z.boolean().optional().default(false),
  parking: z.number().int().min(0).max(10).optional().default(0),
  amenities: z.array(z.string()).optional().default([]),
  description_en: z.string().min(10),
  description_ar: z.string().optional().nullable(),
  photos: z.array(z.string()).optional().default([]),
});

const validProperty = {
  title: 'Luxury 2BR in Dubai Marina',
  type: 'apartment' as const,
  purpose: 'rent' as const,
  price_aed: 95000,
  bedrooms: 2,
  bathrooms: 2,
  size_sqft: 1200,
  area: 'Dubai Marina',
  latitude: 25.0805,
  longitude: 55.1403,
  description_en: 'A stunning waterfront apartment with marina views.',
};

describe('CreatePropertySchema', () => {
  it('accepts a valid property', () => {
    const result = CreatePropertySchema.safeParse(validProperty);
    expect(result.success).toBe(true);
  });

  it('rejects title shorter than 5 chars', () => {
    const result = CreatePropertySchema.safeParse({ ...validProperty, title: 'Hi' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid property type', () => {
    const result = CreatePropertySchema.safeParse({ ...validProperty, type: 'penthouse' });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = CreatePropertySchema.safeParse({ ...validProperty, price_aed: -1000 });
    expect(result.success).toBe(false);
  });

  it('rejects size below minimum', () => {
    const result = CreatePropertySchema.safeParse({ ...validProperty, size_sqft: 50 });
    expect(result.success).toBe(false);
  });

  it('rejects description shorter than 10 chars', () => {
    const result = CreatePropertySchema.safeParse({ ...validProperty, description_en: 'Short' });
    expect(result.success).toBe(false);
  });

  it('defaults optional fields', () => {
    const result = CreatePropertySchema.parse(validProperty);
    expect(result.furnished).toBe(false);
    expect(result.pet_friendly).toBe(false);
    expect(result.near_metro).toBe(false);
    expect(result.parking).toBe(0);
    expect(result.amenities).toEqual([]);
    expect(result.photos).toEqual([]);
  });

  it('accepts optional fields when provided', () => {
    const result = CreatePropertySchema.safeParse({
      ...validProperty,
      furnished: true,
      pet_friendly: true,
      near_metro: true,
      parking: 2,
      amenities: ['Pool', 'Gym'],
      description_ar: 'وصف عربي',
      photos: ['photo1.jpg'],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.furnished).toBe(true);
      expect(result.data.amenities).toHaveLength(2);
    }
  });

  it('rejects invalid latitude', () => {
    const result = CreatePropertySchema.safeParse({ ...validProperty, latitude: 100 });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer bedrooms', () => {
    const result = CreatePropertySchema.safeParse({ ...validProperty, bedrooms: 2.5 });
    expect(result.success).toBe(false);
  });
});
