export type VerificationStatus = 'verified' | 'pending';

export type ProjectCategory =
  | 'AI & Machine Learning'
  | 'Distributed Systems & Backend'
  | 'Full-Stack Web'
  | 'Core Algorithms & Tools';

export type ProjectStatus = 'completed' | 'active' | 'in-progress' | 'prototype' | 'archived';

export type SkillProficiencyLevel = 'advanced' | 'proficient' | 'intermediate' | 'familiar';

export interface SocialProfile {
  platform: 'github' | 'linkedin' | 'codeforces' | 'codechef' | 'leetcode' | 'hackerrank' | 'telegram' | 'x' | 'email';
  label: string;
  url: string;
  username: string;
  isPrimary: boolean;
}

export interface PersonalProfile {
  name: string;
  headline: string;
  role: string;
  shortBio: string;
  longBio: string[];
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  status: {
    isAvailableForWork: boolean;
    availabilityNotice: string;
  };
  socials: SocialProfile[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  specialization: string;
  startYear: number;
  endYear: number;
  cgpa: string;
  coursework: string[];
  verificationStatus: VerificationStatus;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  employmentType: 'Full-time' | 'Internship' | 'Virtual Simulation' | 'Apprenticeship';
  category: 'Professional Internship' | 'Virtual Job Simulation';
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string[];
  technologies: string[];
  verificationUrl?: string;
  verificationStatus: VerificationStatus;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  name: string;
  shortDescription: string;
  detailedOverview: string;
  problemStatement: string;
  solution: string;
  architectureHighlights: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  technologies: string[];
  keyFeatures: string[];
  metrics?: ProjectMetric[];
  githubUrl: string;
  liveDemoUrl?: string;
  previewImage?: string;
  isFeatured: boolean;
  displayOrder: number;
  evidenceSource: string;
  verificationStatus: VerificationStatus;
}

export interface TechnicalSkill {
  name: string;
  category: SkillCategory;
  iconName?: string;
  proficiency: SkillProficiencyLevel;
  highlight: boolean;
  yearsExperience?: number;
}

export type SkillCategory =
  | 'Programming Languages'
  | 'Frontend Development'
  | 'Backend Development'
  | 'Databases'
  | 'AI / Machine Learning'
  | 'Cloud & DevOps'
  | 'Developer Tools'
  | 'Core Computer Science';

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerCategory: 'Financial Services' | 'Cloud & Enterprise' | 'Technology' | 'Academic';
  issueDate: string;
  credentialUrl?: string;
  skillsVerified: string[];
  verificationStatus: VerificationStatus;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Competitive Programming' | 'Hackathon' | 'Academic' | 'Skill Verification';
  organization: string;
  metric?: string;
  description: string;
  date: string;
  proofUrl?: string;
  featured: boolean;
  verificationStatus: VerificationStatus;
}

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  teamName: string;
  role: string;
  projectName: string;
  projectSlug?: string;
  outcome: string;
  date: string;
  technologies: string[];
  projectRepoUrl?: string;
  verificationStatus: VerificationStatus;
}

export interface CompetitiveProgrammingProfile {
  platform: 'Codeforces' | 'CodeChef' | 'LeetCode' | 'HackerRank';
  handle: string;
  profileUrl: string;
  currentRating?: number;
  maxRating?: number;
  rankTitle?: string;
  stars?: string;
  problemsSolved?: number;
  badges?: string[];
  globalContestsParticipated?: number;
  dataSource: 'live-api' | 'verified-snapshot';
  lastUpdated: string;
  retrievedAt?: string;
  verificationStatus: VerificationStatus;
}

export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  dateRange: string;
  category: 'Experience' | 'Education' | 'Hackathon' | 'Milestone';
  summary: string;
  technologies?: string[];
  link?: string;
}
