import { githubClient } from './client';
import { GitHubRepoApi } from './schemas';
import { projectList } from '@/content/projects';

export interface CuratedRepoConfig {
  repoName: string;
  isFeatured: boolean;
  isHidden: boolean;
  customDescription?: string;
  category?: 'AI & Machine Learning' | 'Distributed Systems & Backend' | 'Full-Stack Web' | 'Core Algorithms & Tools';
  displayOrder: number;
}

export const REPOSITORY_CURATION_MAP: Record<string, CuratedRepoConfig> = {
  'ROADWATCH-AI': {
    repoName: 'ROADWATCH-AI',
    isFeatured: true,
    isHidden: false,
    customDescription:
      'AI-powered road safety intelligence platform detecting hazards, predicting risk indices, and accelerating municipal repair workflows with real-time Socket.IO telemetry (IIT Madras CoERS Hackathon).',
    category: 'AI & Machine Learning',
    displayOrder: 1,
  },
  'ai-resume-analyzer': {
    repoName: 'ai-resume-analyzer',
    isFeatured: true,
    isHidden: false,
    customDescription:
      'Semantic NLP engine using Sentence-BERT (all-MiniLM-L6-v2), spaCy NER, and TF-IDF to evaluate ATS compatibility and skill gap analysis.',
    category: 'AI & Machine Learning',
    displayOrder: 2,
  },
  RescueAI: {
    repoName: 'RescueAI',
    isFeatured: true,
    isHidden: false,
    customDescription:
      'Disaster Response & Decision Intelligence Command Center with Google Gemini AI and Google Maps geospatial incident tracking.',
    category: 'AI & Machine Learning',
    displayOrder: 3,
  },
  'Web-Project': {
    repoName: 'Web-Project',
    isFeatured: false,
    isHidden: false,
    customDescription:
      'Full-Stack Transportation Management System with 15+ Express REST APIs, JWT authentication, SQLite3 persistence, and Helmet security.',
    category: 'Full-Stack Web',
    displayOrder: 4,
  },
  StadiumX: {
    repoName: 'StadiumX',
    isFeatured: false,
    isHidden: false,
    customDescription:
      'Interactive venue seating and event management prototype built with React, Vite, Firebase, and Google GenAI.',
    category: 'Full-Stack Web',
    displayOrder: 5,
  },
  'scalecart-microservices': {
    repoName: 'scalecart-microservices',
    isFeatured: false,
    isHidden: false,
    customDescription:
      'Distributed E-Commerce Microservices architectural study in Java 21 & Spring Boot (extending open-source base architecture by Ashifur Nahid).',
    category: 'Distributed Systems & Backend',
    displayOrder: 6,
  },
  // Explicitly hidden repositories (experiments, tutorials, homework assignments)
  'C-tutorial': { repoName: 'C-tutorial', isFeatured: false, isHidden: true, displayOrder: 99 },
  Birthday: { repoName: 'Birthday', isFeatured: false, isHidden: true, displayOrder: 99 },
  Birthday2: { repoName: 'Birthday2', isFeatured: false, isHidden: true, displayOrder: 99 },
  insta: { repoName: 'insta', isFeatured: false, isHidden: true, displayOrder: 99 },
  Task: { repoName: 'Task', isFeatured: false, isHidden: true, displayOrder: 99 },
  Today: { repoName: 'Today', isFeatured: false, isHidden: true, displayOrder: 99 },
  yucca: { repoName: 'yucca', isFeatured: false, isHidden: true, displayOrder: 99 },
  Internship: { repoName: 'Internship', isFeatured: false, isHidden: true, displayOrder: 99 },
  'internship-task-2': { repoName: 'internship-task-2', isFeatured: false, isHidden: true, displayOrder: 99 },
  'internship-task-3': { repoName: 'internship-task-3', isFeatured: false, isHidden: true, displayOrder: 99 },
};

export interface ProcessedRepository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage?: string | null;
  stars: number;
  forks: number;
  primaryLanguage: string;
  topics: string[];
  isFeatured: boolean;
  category: string;
  displayOrder: number;
  updatedAt: string;
}

export class RepositoryService {
  /**
   * Generates local fallback dataset from curated static projects
   * when GitHub API is unreachable, offline, or rate-limited.
   */
  getLocalFallbackRepositories(): ProcessedRepository[] {
    return projectList.map((project, idx) => ({
      id: 1000000 + idx,
      name: project.name,
      fullName: `RANAPRINCE06/${project.slug}`,
      description: project.shortDescription,
      url: project.githubUrl,
      homepage: project.liveDemoUrl || null,
      stars: 0,
      forks: 0,
      primaryLanguage: project.technologies[0] || 'TypeScript',
      topics: project.technologies.slice(0, 5),
      isFeatured: project.isFeatured,
      category: project.category,
      displayOrder: project.displayOrder,
      updatedAt: '2026-03-01T00:00:00Z',
    }));
  }

  /**
   * Fetches public repositories from GitHub and applies the curation filter.
   */
  async getCuratedRepositories(): Promise<{
    repositories: ProcessedRepository[];
    featured: ProcessedRepository[];
    fromFallback: boolean;
  }> {
    const { data: rawRepos } = await githubClient.getRepositories();

    if (!rawRepos || rawRepos.length === 0) {
      const fallback = this.getLocalFallbackRepositories();
      return {
        repositories: fallback,
        featured: fallback.filter((r) => r.isFeatured),
        fromFallback: true,
      };
    }

    const processed: ProcessedRepository[] = [];

    for (const repo of rawRepos) {
      const curation = REPOSITORY_CURATION_MAP[repo.name];

      // Exclude hidden repositories
      if (curation?.isHidden) {
        continue;
      }

      processed.push({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: curation?.customDescription || repo.description || 'Public software engineering repository.',
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        primaryLanguage: repo.language || 'Software',
        topics: repo.topics || [],
        isFeatured: curation?.isFeatured ?? false,
        category: curation?.category || 'General Engineering',
        displayOrder: curation?.displayOrder ?? 50,
        updatedAt: repo.updated_at,
      });
    }

    processed.sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      if (b.stars !== a.stars) {
        return b.stars - a.stars;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return {
      repositories: processed,
      featured: processed.filter((r) => r.isFeatured),
      fromFallback: false,
    };
  }
}

export const repositoryService = new RepositoryService();
