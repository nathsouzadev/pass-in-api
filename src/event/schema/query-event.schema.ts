import { z } from 'zod';

export const getAttendeeSchema = z.object({
  query: z.string().nullish(),
  pageIndex: z.string().nullish().default('0').transform(Number),
});
