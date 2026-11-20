import { z } from 'zod';

export const LeadStatusSchema = z.enum([
  'new',
  'contacted',
  'viewing_booked',
  'closed',
  'lost',
]);

export const UpdateLeadSchema = z.object({
  status: LeadStatusSchema,
});

export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;
