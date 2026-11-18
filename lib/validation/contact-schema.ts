import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name cannot exceed 100 characters' })
    .regex(/^[a-zA-Z\s.'-]+$/, { message: 'Name contains invalid characters' }),
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .max(120, { message: 'Email cannot exceed 120 characters' }),
  subject: z
    .string()
    .min(3, { message: 'Subject must be at least 3 characters long' })
    .max(150, { message: 'Subject cannot exceed 150 characters' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters long' })
    .max(3000, { message: 'Message cannot exceed 3000 characters' }),
  honeypot: z.string().max(0, { message: 'Bot detected' }).optional().or(z.literal('')),
});

export type ContactFormData = z.infer<typeof contactSchema>;
