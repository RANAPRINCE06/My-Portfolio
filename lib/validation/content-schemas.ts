import { z } from 'zod';

export const VerificationStatusSchema = z.enum(['verified', 'pending']);

export const SocialProfileSchema = z.object({
  platform: z.enum([
    'github',
    'linkedin',
    'codeforces',
    'codechef',
    'leetcode',
    'hackerrank',
    'telegram',
    'x',
    'email',
  ]),
  label: z.string().min(1),
  url: z.string().url(),
  username: z.string().min(1),
  isPrimary: z.boolean(),
});

export const PersonalProfileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  role: z.string().min(1),
  shortBio: z.string().min(10),
  longBio: z.array(z.string().min(10)).min(1),
  location: z.string().min(1),
  avatarUrl: z.string().min(1),
  resumeUrl: z.string().url(),
  status: z.object({
    isAvailableForWork: z.boolean(),
    availabilityNotice: z.string().min(1),
  }),
  socials: z.array(SocialProfileSchema).min(1),
});

export const EducationSchema = z.object({
  id: z.string().min(1),
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().min(1),
  specialization: z.string().min(1),
  startYear: z.number().int().min(2000),
  endYear: z.number().int().min(2000),
  cgpa: z.string().optional(),
  coursework: z.array(z.string()).min(1),
  verificationStatus: VerificationStatusSchema,
});

export const ExperienceSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  companyUrl: z.string().url().optional(),
  employmentType: z.enum(['Full-time', 'Internship', 'Virtual Simulation', 'Apprenticeship']),
  location: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  isCurrent: z.boolean(),
  description: z.array(z.string()).min(1),
  technologies: z.array(z.string()).min(1),
  verificationUrl: z.string().url().optional(),
  verificationStatus: VerificationStatusSchema,
});

export const ProjectMetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const ProjectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  shortDescription: z.string().min(10),
  detailedOverview: z.string().min(20),
  problemStatement: z.string().min(10),
  solution: z.string().min(10),
  architectureHighlights: z.array(z.string()).min(1),
  category: z.enum([
    'AI & Machine Learning',
    'Distributed Systems & Backend',
    'Full-Stack Web',
    'Core Algorithms & Tools',
  ]),
  status: z.enum(['completed', 'active', 'in-progress', 'prototype', 'archived']),
  technologies: z.array(z.string()).min(1),
  keyFeatures: z.array(z.string()).min(1),
  metrics: z.array(ProjectMetricSchema).optional(),
  githubUrl: z.string().url(),
  liveDemoUrl: z.string().url().optional(),
  previewImage: z.string().optional(),
  isFeatured: z.boolean(),
  displayOrder: z.number().int().nonnegative(),
  evidenceSource: z.string().min(1),
  verificationStatus: VerificationStatusSchema,
});

export const SkillCategorySchema = z.enum([
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Databases',
  'AI / Machine Learning',
  'Cloud & DevOps',
  'Developer Tools',
  'Core Computer Science',
]);

export const TechnicalSkillSchema = z.object({
  name: z.string().min(1),
  category: SkillCategorySchema,
  iconName: z.string().optional(),
  proficiency: z.enum(['advanced', 'proficient', 'intermediate', 'familiar']),
  highlight: z.boolean(),
  yearsExperience: z.number().optional(),
});

export const CertificationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  issuer: z.string().min(1),
  issuerCategory: z.enum(['Financial Services', 'Cloud & Enterprise', 'Technology', 'Academic']),
  issueDate: z.string().min(1),
  credentialUrl: z.string().url().optional(),
  skillsVerified: z.array(z.string()).min(1),
  verificationStatus: VerificationStatusSchema,
});

export const AchievementSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(['Competitive Programming', 'Hackathon', 'Academic', 'Skill Verification']),
  organization: z.string().min(1),
  metric: z.string().optional(),
  description: z.string().min(10),
  date: z.string().min(1),
  proofUrl: z.string().url().optional(),
  featured: z.boolean(),
  verificationStatus: VerificationStatusSchema,
});

export const HackathonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  organizer: z.string().min(1),
  teamName: z.string().min(1),
  role: z.string().min(1),
  projectName: z.string().min(1),
  projectSlug: z.string().optional(),
  outcome: z.string().min(1),
  date: z.string().min(1),
  technologies: z.array(z.string()).min(1),
  projectRepoUrl: z.string().url().optional(),
  verificationStatus: VerificationStatusSchema,
});

export const CompetitiveProgrammingProfileSchema = z.object({
  platform: z.enum(['Codeforces', 'CodeChef', 'LeetCode', 'HackerRank']),
  handle: z.string().min(1),
  profileUrl: z.string().url(),
  currentRating: z.number().int().nonnegative().optional(),
  maxRating: z.number().int().nonnegative().optional(),
  rankTitle: z.string().optional(),
  stars: z.string().optional(),
  problemsSolved: z.number().int().nonnegative().optional(),
  badges: z.array(z.string()).optional(),
  globalContestsParticipated: z.number().int().nonnegative().optional(),
  dataSource: z.enum(['live-api', 'verified-snapshot']),
  lastUpdated: z.string().min(1),
  verificationStatus: VerificationStatusSchema,
});

