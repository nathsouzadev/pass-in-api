import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(4),
  details: z.string().nullable(),
  maxAttendees: z.number().int().positive().nullable(),
});
