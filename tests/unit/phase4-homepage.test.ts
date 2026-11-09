import { describe, it, expect } from 'vitest';
import {
  HeroSection,
  LiveTelemetry,
  ProjectsSection,
  BentoShowcase,
  ContactSection,
} from '@/components/sections';
import {
  projectList,
  competitiveProgrammingProfiles,
  educationList,
  professionalInternships,
} from '@/content';

describe('Phase 4 Homepage & Showcase Architecture Suite', () => {
  it('verifies all homepage sections are cleanly exported components', () => {
    expect(HeroSection).toBeDefined();
    expect(LiveTelemetry).toBeDefined();
    expect(ProjectsSection).toBeDefined();
    expect(BentoShowcase).toBeDefined();
    expect(ContactSection).toBeDefined();
  });

  it('validates verified projects data conforms to portfolio requirements', () => {
    expect(projectList.length).toBeGreaterThanOrEqual(5);

    const roadwatch = projectList.find((p) => p.slug === 'roadwatch-ai');
    expect(roadwatch).toBeDefined();
    expect(roadwatch?.name).toBe('RoadWatch AI');
    expect(roadwatch?.githubUrl).toBe('https://github.com/RANAPRINCE06/ROADWATCH-AI');
    expect(roadwatch?.verificationStatus).toBe('verified');

    const resumeAnalyzer = projectList.find((p) => p.slug === 'ai-resume-analyzer');
    expect(resumeAnalyzer).toBeDefined();
    expect(resumeAnalyzer?.liveDemoUrl).toBe('https://ai-resume-analyzer-seven-bice.vercel.app');

    const stadiumX = projectList.find((p) => p.slug === 'stadium-x');
    expect(stadiumX).toBeDefined();
    expect(stadiumX?.githubUrl).toBe('https://github.com/RANAPRINCE06/StadiumX');
  });

  it('validates competitive programming profile telemetry facts', () => {
    const cf = competitiveProgrammingProfiles.find((p) => p.platform === 'Codeforces');
    expect(cf).toBeDefined();
    expect(cf?.currentRating).toBe(1498);
    expect(cf?.maxRating).toBe(1565);
    expect(cf?.rankTitle).toBe('Specialist');

    const cc = competitiveProgrammingProfiles.find((p) => p.platform === 'CodeChef');
    expect(cc).toBeDefined();
    expect(cc?.stars).toBe('3★');
    expect(cc?.currentRating).toBe(1606);

    const lc = competitiveProgrammingProfiles.find((p) => p.platform === 'LeetCode');
    expect(lc).toBeDefined();
    expect(lc?.problemsSolved).toBe(400);
  });

  it('validates education credentials match Parul University B.Tech AI profile with 7.96 CGPA', () => {
    const edu = educationList[0];
    expect(edu.institution).toBe('Parul University');
    expect(edu.cgpa).toBe('7.96');
    expect(edu.startYear).toBe(2024);
    expect(edu.endYear).toBe(2028);
  });

  it('validates verified professional internship dates are strictly June 2026 - July 2026', () => {
    expect(professionalInternships.length).toBe(2);
    expect(professionalInternships[0].startDate).toBe('June 2026');
    expect(professionalInternships[0].endDate).toBe('July 2026');
    expect(professionalInternships[1].startDate).toBe('June 2026');
    expect(professionalInternships[1].endDate).toBe('July 2026');
  });
});

