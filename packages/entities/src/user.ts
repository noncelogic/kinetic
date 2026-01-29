import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.pick({
  email: true,
  name: true,
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UserSchema.pick({
  name: true,
}).partial();

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
