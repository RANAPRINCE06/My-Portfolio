import { describe, it, expect } from 'vitest';
import { validateAllContent, personalProfile, projectList, educationList } from '@/content';
import {
  PersonalProfileSchema,
  ProjectSchema,
  EducationSchema,
} from '@/lib/validation/content-schemas';

describe('Phase 2 Content Validation Suite', () => {
  it('successfully validates all static content files against Zod schemas', () => {
    const result = validateAllContent();
    expect(result.valid).toBe(true);
    expect(result.summary.profile).toBe(1);
    expect(result.summary.projects).toBeGreaterThanOrEqual(5);
    expect(result.summary.education).toBe(1);
    expect(result.summary.skills).toBeGreaterThanOrEqual(20);
    expect(result.summary.certifications).toBeGreaterThanOrEqual(6);
    expect(result.summary.achievements).toBeGreaterThanOrEqual(4);
    expect(result.summary.hackathons).toBeGreaterThanOrEqual(1);
    expect(result.summary.competitiveProgramming).toBe(4);
  });

  it('validates personal profile with required fields and URLs', () => {
    expect(() => PersonalProfileSchema.parse(personalProfile)).not.toThrow();
    expect(personalProfile.name).toBe('Prince Rana');
    expect(personalProfile.resumeUrl).toMatch(/^https:\/\//);
  });

  it('rejects a profile with an invalid resume URL or missing required fields', () => {
    const invalidProfile = {
      ...personalProfile,
      resumeUrl: 'not-a-valid-url',
    };
    expect(() => PersonalProfileSchema.parse(invalidProfile)).toThrow();
  });

  it('validates all curated projects have verified status, valid categories, and valid URLs', () => {
    for (const project of projectList) {
      expect(() => ProjectSchema.parse(project)).not.toThrow();
      expect(project.githubUrl).toMatch(/^https:\/\/github\.com\/RANAPRINCE06\//);
      expect(project.verificationStatus).toBe('verified');
      expect(project.problemStatement.length).toBeGreaterThanOrEqual(10);
      expect(project.solution.length).toBeGreaterThanOrEqual(10);
    }
  });

  it('rejects a project missing required architecture highlights or problem statement', () => {
    const invalidProject = {
      ...projectList[0],
      architectureHighlights: [], // Must have at least 1
    };
    expect(() => ProjectSchema.parse(invalidProject)).toThrow();
  });

  it('validates education credentials match Parul University B.Tech AI profile', () => {
    const edu = educationList[0];
    expect(() => EducationSchema.parse(edu)).not.toThrow();
    expect(edu.institution).toBe('Parul University');
    expect(edu.startYear).toBe(2024);
    expect(edu.endYear).toBe(2028);
    expect(edu.cgpa).toBe('7.95');
  });
});

