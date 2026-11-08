import { describe, it, expect } from 'vitest';
import {
  validateAllContent,
  personalProfile,
  projectList,
  educationList,
  professionalInternships,
  virtualJobSimulations,
} from '@/content';
import {
  PersonalProfileSchema,
  ProjectSchema,
  EducationSchema,
  ExperienceSchema,
} from '@/lib/validation/content-schemas';

describe('Phase 2.2 Content Validation & Synchronization Suite', () => {
  it('successfully validates all static content files against Zod schemas', () => {
    const result = validateAllContent();
    expect(result.valid).toBe(true);
    expect(result.summary.profile).toBe(1);
    expect(result.summary.education).toBe(1);
    expect(result.summary.professionalInternships).toBe(2);
    expect(result.summary.virtualSimulations).toBe(6);
    expect(result.summary.totalExperience).toBe(8);
    expect(result.summary.projects).toBeGreaterThanOrEqual(5);
    expect(result.summary.skills).toBeGreaterThanOrEqual(20);
    expect(result.summary.certifications).toBeGreaterThanOrEqual(10);
    expect(result.summary.achievements).toBeGreaterThanOrEqual(4);
    expect(result.summary.hackathons).toBeGreaterThanOrEqual(1);
    expect(result.summary.competitiveProgramming).toBe(4);
  });

  it('verifies professional internships are separated from virtual job simulations', () => {
    expect(professionalInternships.length).toBe(2);
    const qskill = professionalInternships.find((i) => i.company === 'QSkill');
    const codec = professionalInternships.find((i) => i.company === 'Codec Technologies India');

    expect(qskill).toBeDefined();
    expect(qskill?.role).toBe('Frontend Developer Intern');
    expect(qskill?.category).toBe('Professional Internship');
    expect(() => ExperienceSchema.parse(qskill)).not.toThrow();

    expect(codec).toBeDefined();
    expect(codec?.role).toBe('AI Intern');
    expect(codec?.category).toBe('Professional Internship');
    expect(() => ExperienceSchema.parse(codec)).not.toThrow();

    expect(virtualJobSimulations.length).toBe(6);
    for (const sim of virtualJobSimulations) {
      expect(sim.category).toBe('Virtual Job Simulation');
      expect(sim.employmentType).toBe('Virtual Simulation');
      expect(() => ExperienceSchema.parse(sim)).not.toThrow();
    }
  });

  it('validates education credentials match Parul University B.Tech AI profile with verified 7.95 CGPA', () => {
    const edu = educationList[0];
    expect(() => EducationSchema.parse(edu)).not.toThrow();
    expect(edu.institution).toBe('Parul University');
    expect(edu.startYear).toBe(2024);
    expect(edu.endYear).toBe(2028);
    expect(edu.cgpa).toBe('7.95');
    expect(edu.verificationStatus).toBe('verified');
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

  it('validates all curated projects have verified status and honest architecture details', () => {
    for (const project of projectList) {
      expect(() => ProjectSchema.parse(project)).not.toThrow();
      expect(project.githubUrl).toMatch(/^https:\/\/github\.com\/RANAPRINCE06\//);
      expect(project.verificationStatus).toBe('verified');
      expect(project.problemStatement.length).toBeGreaterThanOrEqual(10);
      expect(project.solution.length).toBeGreaterThanOrEqual(10);
      // Ensure no broken demo links
      if (project.liveDemoUrl) {
        expect(project.liveDemoUrl).toMatch(/^https:\/\//);
      }
    }
  });
});
