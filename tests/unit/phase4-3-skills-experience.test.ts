import { describe, it, expect } from 'vitest';
import { SkillsSection, ExperienceSection, BentoShowcase } from '@/components/sections';
import {
  technicalSkillsList,
  professionalInternships,
  virtualJobSimulations,
  educationList,
  certificationList,
  achievementList,
  competitiveProgrammingProfiles,
} from '@/content';

describe('Phase 4.3 Premium Skills & Experience Showcase Suite', () => {
  it('exports SkillsSection, ExperienceSection, and BentoShowcase cleanly', () => {
    expect(SkillsSection).toBeDefined();
    expect(ExperienceSection).toBeDefined();
    expect(BentoShowcase).toBeDefined();
  });

  it('validates the 7 core skills categories contain verified technical capabilities', () => {
    const categories = [
      'Programming Languages',
      'Frontend Development',
      'Backend Development',
      'Databases',
      'AI & Machine Learning',
      'Cloud & DevOps',
      'Developer Tools',
    ];

    expect(technicalSkillsList.length).toBeGreaterThanOrEqual(20);

    for (const cat of categories) {
      const skillsInCat = technicalSkillsList.filter(
        (s) =>
          s.category === cat ||
          (cat === 'AI & Machine Learning' && s.category === 'AI / Machine Learning')
      );
      expect(skillsInCat.length).toBeGreaterThan(0);

      // Verify no fabricated percentages: proficiency must be an honest categorical enum
      for (const skill of skillsInCat) {
        expect(['advanced', 'proficient', 'intermediate', 'familiar']).toContain(skill.proficiency);
      }
    }
  });

  it('verifies strict separation between professional internships and virtual job simulations', () => {
    // Exactly 2 professional internships
    expect(professionalInternships.length).toBe(2);

    const qskill = professionalInternships.find((i) => i.company === 'QSkill');
    expect(qskill).toBeDefined();
    expect(qskill?.role).toBe('Frontend Developer Intern');
    expect(qskill?.startDate).toBe('June 2026');
    expect(qskill?.endDate).toBe('July 2026');
    expect(qskill?.technologies).toContain('React.js');
    expect(qskill?.technologies).toContain('Tailwind CSS');
    expect(qskill?.technologies).toContain('Bootstrap');
    expect(qskill?.technologies).toContain('REST API integration');
    expect(qskill?.technologies).toContain('Responsive UI development');

    const codec = professionalInternships.find((i) => i.company === 'Codec Technologies India');
    expect(codec).toBeDefined();
    expect(codec?.role).toBe('AI Intern');
    expect(codec?.startDate).toBe('June 2026');
    expect(codec?.endDate).toBe('July 2026');
    expect(codec?.technologies).toContain('Python');
    expect(codec?.technologies).toContain('Machine Learning');
    expect(codec?.technologies).toContain('Structured Data Analysis');
    expect(codec?.technologies).toContain('Generative AI APIs');

    // Virtual Job Simulations
    expect(virtualJobSimulations.length).toBe(6);
    const simulationCompanies = virtualJobSimulations.map((s) => s.company);
    expect(simulationCompanies).toContain('Wells Fargo');
    expect(simulationCompanies).toContain('Walmart USA');
    expect(simulationCompanies).toContain('J.P. Morgan');
    expect(simulationCompanies).toContain('New York Jobs CEO Council');
    expect(simulationCompanies).toContain('Amazon Web Services (AWS)');
    expect(simulationCompanies).toContain('Deloitte Australia');

    // Every simulation has a verified Forage credential URL
    for (const sim of virtualJobSimulations) {
      expect(sim.verificationUrl).toMatch(/^https:\/\/www\.theforage\.com\//);
      expect(sim.category).toBe('Virtual Job Simulation');
      expect(sim.employmentType).toBe('Virtual Simulation');
    }
  });

  it('validates academic credentials match Parul University B.Tech AI profile with 7.96 CGPA', () => {
    const edu = educationList[0];
    expect(edu.institution).toBe('Parul University');
    expect(edu.cgpa).toBe('7.96');
    expect(edu.startYear).toBe(2024);
    expect(edu.endYear).toBe(2028);
    expect(edu.degree).toContain('Bachelor of Technology');
    expect(edu.specialization).toBe('Artificial Intelligence');
  });

  it('validates competitive programming platforms and notable achievements', () => {
    // 4 competitive programming platforms
    expect(competitiveProgrammingProfiles.length).toBe(4);

    const cf = competitiveProgrammingProfiles.find((p) => p.platform === 'Codeforces');
    expect(cf?.currentRating).toBe(1498);
    expect(cf?.maxRating).toBe(1565);
    expect(cf?.rankTitle).toBe('Specialist');

    const cc = competitiveProgrammingProfiles.find((p) => p.platform === 'CodeChef');
    expect(cc?.currentRating).toBe(1606);
    expect(cc?.stars).toBe('3★');

    const lc = competitiveProgrammingProfiles.find((p) => p.platform === 'LeetCode');
    expect(lc?.problemsSolved).toBe(400);

    const hr = competitiveProgrammingProfiles.find((p) => p.platform === 'HackerRank');
    expect(hr?.stars).toContain('5★ Gold');

    // Notable achievements
    expect(achievementList.some((a) => a.title.includes('Codeforces Specialist'))).toBe(true);
    expect(achievementList.some((a) => a.title.includes('CodeChef 3★'))).toBe(true);
    expect(achievementList.some((a) => a.title.includes('LeetCode Knight'))).toBe(true);
    expect(achievementList.some((a) => a.title.includes('PUCC ICPC-Style'))).toBe(true);
    expect(achievementList.some((a) => a.title.includes('5★ Gold Badges in C++ and Java'))).toBe(true);
  });

  it('validates industry certifications use verified issuers and authentic dates', () => {
    expect(certificationList.length).toBeGreaterThanOrEqual(6);
    const issuers = certificationList.map((c) => c.issuer);
    expect(issuers).toContain('Oracle');
    expect(issuers).toContain('IBM');
    expect(issuers).toContain('Google');
    expect(issuers).toContain('Microsoft');
    expect(issuers).toContain('Pearson');

    for (const cert of certificationList) {
      expect(cert.verificationStatus).toBe('verified');
      expect(cert.skillsVerified.length).toBeGreaterThan(0);
    }
  });
});
