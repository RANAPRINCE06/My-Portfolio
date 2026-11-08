declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_SITE_URL?: string;
    RESEND_API_KEY?: string;
    CONTACT_EMAIL_RECIPIENT?: string;
    GITHUB_ACCESS_TOKEN?: string;
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
  }
}

