import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export type UserInput = z.infer<typeof userSchema>;
