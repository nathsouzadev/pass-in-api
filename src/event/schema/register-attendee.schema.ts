import { z } from 'zod';

export const registerAttendeeSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
});
