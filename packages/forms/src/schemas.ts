import { z } from 'zod';

/**
 * Example form schemas
 * 
 * Use .describe() to set labels
 * Schemas drive both validation AND form generation
 */

export const ContactFormSchema = z.object({
  email: z.string().email().describe('Email Address'),
  name: z.string().min(2).max(100).describe('Full Name'),
  company: z.string().optional().describe('Company (Optional)'),
  message: z.string().min(10).max(1000).describe('Message'),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export const SignupFormSchema = z.object({
  email: z.string().email().describe('Email'),
  password: z.string().min(8).describe('Password'),
  confirmPassword: z.string().describe('Confirm Password'),
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: 'You must accept the terms',
  }).describe('I accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof SignupFormSchema>;
