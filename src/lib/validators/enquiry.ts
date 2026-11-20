import { z } from 'zod';

export const EnquirySchema = z.object({
  property_id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  message: z.string().max(1000).optional(),
  preferred_contact_time: z.string().max(50).optional(),
});

export type EnquiryInput = z.infer<typeof EnquirySchema>;
