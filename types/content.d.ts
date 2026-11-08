export type VerificationStatus = 'verified' | 'pending';

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'codeforces' | 'codechef' | 'leetcode' | 'telegram' | 'x' | 'email';
  label: string;
  url: string;
  displayValue: string;
}

export interface ProfileData {
  name: string;
  role: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  location: string;
  status: {
    availableForWork: boolean;
    label: string;
  };
  socials: SocialLink[];
}

export interface CompetitiveProgrammingRecord {
  platform: 'Codeforces' | 'CodeChef' | 'LeetCode' | 'HackerRank';
  handle: string;
  rating?: number;
  rankTitle?: string;
  stars?: string;
  problemsSolved?: number;
  profileUrl: string;
  verificationStatus: VerificationStatus;
}

export interface CuratedProject {
  slug: string;
  title: string;
  tagline: string;
  category: 'Full-Stack' | 'AI & Machine Learning' | 'Systems & Tools';
  problemStatement: string;
  architectureSolution: string;
  technologies: string[];
  keyFeatures: string[];
  metrics?: { label: string; value: string }[];
  repoUrl: string;
  liveDemoUrl?: string;
  previewImage: string;
  featured: boolean;
  verificationStatus: VerificationStatus;
}

export interface VirtualSimulation {
  id: string;
  organization: string;
  title: string;
  category: 'Virtual Job Simulation' | 'Milestone';
  dateRange: string;
  verificationUrl?: string;
  skillsLearned: string[];
  summary: string;
  verificationStatus: VerificationStatus;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  specialization: string;
  period: string;
  cgpa?: string;
  verificationStatus: VerificationStatus;
}

