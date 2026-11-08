import { describe, it, expect } from 'vitest';
import { getValidatedEnv } from '@/lib/env';

describe('Environment Validator', () => {
  it('returns valid default configuration when environment variables are missing', () => {
    const config = getValidatedEnv();
    expect(config.NEXT_PUBLIC_SITE_URL).toBeDefined();
    expect(config.CONTACT_EMAIL_RECIPIENT).toBe('rana.prince1806@gmail.com');
  });
});

