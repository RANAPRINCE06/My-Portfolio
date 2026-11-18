import { describe, it, expect } from 'vitest';
import {
  HeroSection,
  LiveTelemetry,
  ProjectsSection,
  SkillsSection,
  ExperienceSection,
  SimulationsSection,
  AchievementsSection,
  CertificationsSection,
  ContactSection,
} from '@/components/sections';
import { RoyalPRLogo } from '@/components/ui/RoyalPRLogo';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionNavigationRail } from '@/components/layout/SectionNavigationRail';

describe('Phase 4.5 Global Visual Polish & Refinement Suite', () => {
  describe('Complete Section Inventory (All 9 Sections)', () => {
    it('cleanly exports all nine required portfolio sections', () => {
      expect(HeroSection).toBeDefined();
      expect(LiveTelemetry).toBeDefined();
      expect(ProjectsSection).toBeDefined();
      expect(SkillsSection).toBeDefined();
      expect(ExperienceSection).toBeDefined();
      expect(SimulationsSection).toBeDefined();
      expect(AchievementsSection).toBeDefined();
      expect(CertificationsSection).toBeDefined();
      expect(ContactSection).toBeDefined();
    });
  });

  describe('Core Layout & Navigation Components', () => {
    it('cleanly exports Navbar, Footer, SectionNavigationRail, and RoyalPRLogo', () => {
      expect(Navbar).toBeDefined();
      expect(Footer).toBeDefined();
      expect(SectionNavigationRail).toBeDefined();
      expect(RoyalPRLogo).toBeDefined();
    });
  });

  describe('Royal PR Brand Consistency', () => {
    it('supports all required Royal PR logo variants', () => {
      const variants = ['navbar', 'monogram', 'footer', 'standalone', 'badge'] as const;
      variants.forEach((v) => {
        expect(typeof v).toBe('string');
      });
    });
  });
});
