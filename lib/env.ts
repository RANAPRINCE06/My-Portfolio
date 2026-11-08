import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://ranaprince.dev'),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL_RECIPIENT: z.string().email().default('rana.prince1806@gmail.com'),
  GITHUB_ACCESS_TOKEN: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function getValidatedEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_EMAIL_RECIPIENT: process.env.CONTACT_EMAIL_RECIPIENT,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  if (!parsed.success) {
    console.warn('Environment validation warning:', parsed.error.format());
    return {
      NEXT_PUBLIC_SITE_URL: 'https://ranaprince.dev',
      CONTACT_EMAIL_RECIPIENT: 'rana.prince1806@gmail.com',
    };
  }

  return parsed.data;
}

export const env = getValidatedEnv();
