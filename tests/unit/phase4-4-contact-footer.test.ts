import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/lib/validation/contact-schema';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { RoyalPRLogo } from '@/components/ui/RoyalPRLogo';

describe('Phase 4.4 Cinematic Contact, Footer & Royal PR Branding Suite', () => {
  describe('Zod Contact Form Validation Schema', () => {
    it('validates correct form submissions', () => {
      const validData = {
        name: 'Alex Mercer',
        email: 'alex.mercer@example.com',
        subject: 'Engineering Opportunity - SDE II',
        message: 'Hello Prince, we reviewed your portfolio and would like to discuss a position on our team.',
        honeypot: '',
      };

      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects names with invalid characters or too short', () => {
      const invalidName = {
        name: '1',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'A valid message that meets length requirements.',
      };

      const result = contactSchema.safeParse(invalidName);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters');
      }
    });

    it('rejects invalid email formats', () => {
      const invalidEmail = {
        name: 'Valid Name',
        email: 'not-an-email',
        subject: 'Test Subject',
        message: 'A valid message that meets length requirements.',
      };

      const result = contactSchema.safeParse(invalidEmail);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email address');
      }
    });

    it('rejects short messages (< 10 chars)', () => {
      const shortMsg = {
        name: 'Valid Name',
        email: 'valid@example.com',
        subject: 'Test Subject',
        message: 'Hi!',
      };

      const result = contactSchema.safeParse(shortMsg);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10 characters');
      }
    });

    it('rejects submissions if honeypot is populated by bots', () => {
      const botSubmission = {
        name: 'Bot Spammer',
        email: 'spammer@bot.net',
        subject: 'Spam Subject line',
        message: 'This is spam content designed to test honeypot filtering.',
        honeypot: 'http://spam-link.example.com',
      };

      const result = contactSchema.safeParse(botSubmission);
      expect(result.success).toBe(false);
    });
  });

  describe('Component Exports & Structure', () => {
    it('cleanly exports ContactSection, Footer, and RoyalPRLogo', () => {
      expect(ContactSection).toBeDefined();
      expect(Footer).toBeDefined();
      expect(RoyalPRLogo).toBeDefined();
    });
  });
});
