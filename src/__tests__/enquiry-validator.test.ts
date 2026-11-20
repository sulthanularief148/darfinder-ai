import { describe, it, expect } from 'vitest';
import { EnquirySchema } from '@/lib/validators/enquiry';

const validEnquiry = {
  property_id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+971501234567',
};

describe('EnquirySchema', () => {
  it('accepts a valid enquiry', () => {
    const result = EnquirySchema.safeParse(validEnquiry);
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const { name, ...rest } = validEnquiry;
    const result = EnquirySchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = EnquirySchema.safeParse({ ...validEnquiry, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for property_id', () => {
    const result = EnquirySchema.safeParse({ ...validEnquiry, property_id: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('accepts optional message', () => {
    const result = EnquirySchema.safeParse({
      ...validEnquiry,
      message: 'I am interested in this property.',
    });
    expect(result.success).toBe(true);
  });

  it('accepts optional preferred_contact_time', () => {
    const result = EnquirySchema.safeParse({
      ...validEnquiry,
      preferred_contact_time: 'Morning',
    });
    expect(result.success).toBe(true);
  });
});
