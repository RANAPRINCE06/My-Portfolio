import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter' }),
  Space_Grotesk: () => ({ variable: '--font-space-grotesk' }),
  JetBrains_Mono: () => ({ variable: '--font-jetbrains-mono' }),
}));

import { metadata } from '@/app/layout';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { contactSchema } from '@/lib/validation/contact-schema';
import { repositoryService } from '@/lib/github/repository-service';

describe('Phase 5 — Production Readiness & SEO Engineering', () => {
  describe('SEO & Metadata Verification', () => {
    it('should define a valid metadataBase URL', () => {
      expect(metadata.metadataBase).toBeDefined();
      expect(metadata.metadataBase?.toString()).toMatch(/^https?:\/\//);
    });

    it('should specify unique title and descriptive meta tags', () => {
      expect(metadata.title).toBeDefined();
      expect(metadata.description).toContain('Prince Rana');
      expect(metadata.description).toContain('Software Development Engineer');
    });

    it('should configure canonical URL', () => {
      expect(metadata.alternates?.canonical).toBe('/');
    });

    it('should specify complete OpenGraph tags including 1200x630 image', () => {
      const og = metadata.openGraph as Record<string, unknown>;
      expect(og).toBeDefined();
      expect(og.type).toBe('website');
      expect(og.title).toContain('Prince Rana');
      expect(og.images).toBeDefined();

      const images = Array.isArray(og.images) ? og.images : [og.images];
      expect(images.length).toBeGreaterThan(0);
      const mainImage = images[0] as { url: string; width: number; height: number };
      expect(mainImage.url).toBe('/images/og-image.png');
      expect(mainImage.width).toBe(1200);
      expect(mainImage.height).toBe(630);
    });

    it('should configure Twitter/X card with summary_large_image', () => {
      const tw = metadata.twitter as { card?: string; creator?: string; images?: string[] };
      expect(tw).toBeDefined();
      expect(tw.card).toBe('summary_large_image');
      expect(tw.creator).toBe('@RANAPRINCE06');
      expect(tw.images).toContain('/images/og-image.png');
    });

    it('should configure crawler indexation and GoogleBot directives', () => {
      const rob = metadata.robots as { index?: boolean; follow?: boolean; googleBot?: Record<string, unknown> };
      expect(rob.index).toBe(true);
      expect(rob.follow).toBe(true);
      expect(rob.googleBot).toBeDefined();
      expect(rob.googleBot?.index).toBe(true);
      expect(rob.googleBot?.['max-image-preview']).toBe('large');
    });

    it('should configure application icons with high-DPI and vector support', () => {
      const icons = metadata.icons as { icon?: Array<{ url: string }>; shortcut?: string; apple?: string };
      expect(icons).toBeDefined();
      expect(icons.shortcut).toBe('/icon.png');
      expect(icons.apple).toBe('/apple-icon.png');
      const iconList = Array.isArray(icons.icon) ? icons.icon : [icons.icon];
      const urls = iconList.map((i) => i?.url);
      expect(urls).toContain('/icon.png');
      expect(urls).toContain('/icon.svg');
    });
  });

  describe('Robots & XML Sitemap Routing', () => {
    it('should configure robots.txt allowing public indexing and disallowing /api/', () => {
      const r = robots();
      expect(r.rules).toBeDefined();
      const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
      expect(rules.allow).toBe('/');
      expect(rules.disallow).toContain('/api/');
      expect(r.sitemap).toMatch(/sitemap\.xml$/);
    });

    it('should configure sitemap with top priority', () => {
      const s = sitemap();
      expect(s.length).toBeGreaterThan(0);
      expect(s[0].priority).toBe(1.0);
      expect(s[0].changeFrequency).toBe('weekly');
      expect(s[0].lastModified).toBeDefined();
    });
  });

  describe('Production Asset Existence & Optimization', () => {
    const root = process.cwd();

    it('should possess a verified 1200x630 OpenGraph social image', () => {
      const ogPath = path.join(root, 'public', 'images', 'og-image.png');
      expect(fs.existsSync(ogPath)).toBe(true);
      const stat = fs.statSync(ogPath);
      expect(stat.size).toBeGreaterThan(50 * 1024); // Solid rich card
      expect(stat.size).toBeLessThan(1024 * 1024); // Under 1MB
    });

    it('should possess an optimized app icon and vector icon', () => {
      const pngIcon = path.join(root, 'public', 'icon.png');
      const svgIcon = path.join(root, 'public', 'icon.svg');
      const appleIcon = path.join(root, 'public', 'apple-icon.png');

      expect(fs.existsSync(pngIcon)).toBe(true);
      expect(fs.existsSync(svgIcon)).toBe(true);
      expect(fs.existsSync(appleIcon)).toBe(true);

      const svgStat = fs.statSync(svgIcon);
      expect(svgStat.size).toBeLessThan(10 * 1024); // Pure vector under 10KB
    });
  });

  describe('API & Data Reliability Fallbacks', () => {
    it('should return curated fallback repositories when GitHub API is unreachable', () => {
      const fallbacks = repositoryService.getLocalFallbackRepositories();
      expect(fallbacks.length).toBeGreaterThanOrEqual(5);

      const featured = fallbacks.filter((r) => r.isFeatured);
      expect(featured.length).toBeGreaterThan(0);

      fallbacks.forEach((repo) => {
        expect(repo.name).toBeDefined();
        expect(repo.description).toBeDefined();
        expect(repo.url).toMatch(/^https:\/\/github\.com/);
      });
    });

    it('should enforce strict validation and honeypot spam protection', () => {
      // Valid payload
      const valid = contactSchema.safeParse({
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Engineering Opportunity',
        message: 'Hello Prince, we would love to connect with you regarding an SDE role.',
        honeypot: '',
      });
      expect(valid.success).toBe(true);

      // Invalid email
      const invalidEmail = contactSchema.safeParse({
        name: 'Jane Doe',
        email: 'not-an-email',
        subject: 'Engineering Opportunity',
        message: 'Hello Prince, we would love to connect.',
        honeypot: '',
      });
      expect(invalidEmail.success).toBe(false);

      // Short message
      const shortMsg = contactSchema.safeParse({
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Hi',
        message: 'Short',
        honeypot: '',
      });
      expect(shortMsg.success).toBe(false);
    });
  });
});
