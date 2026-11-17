import { describe, it, expect } from 'vitest';
import { projectList } from '@/content/projects';
import { ProjectSchema } from '@/lib/validation/content-schemas';
import { ProjectModal } from '@/components/ui/ProjectModal';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { ProjectVisual } from '@/components/ui/ProjectVisual';
import { ProjectsSection } from '@/components/sections/ProjectsSection';

describe('Phase 4.2C Cinematic Project Showcase Suite', () => {
  it('exports all Phase 4.2C showcase components cleanly', () => {
    expect(ProjectsSection).toBeDefined();
    expect(ProjectCard).toBeDefined();
    expect(ProjectModal).toBeDefined();
    expect(ProjectVisual).toBeDefined();
  });

  it('validates prioritized featured projects: PayRecover AI, RoadWatch AI, StadiumX', () => {
    // 1. PayRecover AI
    const payrecover = projectList.find((p) => p.slug === 'payrecover-ai');
    expect(payrecover).toBeDefined();
    expect(payrecover?.name).toBe('PayRecover AI');
    expect(payrecover?.isFeatured).toBe(true);
    expect(payrecover?.displayOrder).toBe(1);
    expect(payrecover?.technologies).toContain('FastAPI');
    expect(payrecover?.technologies).toContain('Google Gemini AI');
    expect(payrecover?.technologies).toContain('PostgreSQL');
    expect(payrecover?.technologies).toContain('Redis');
    expect(payrecover?.architectureDiagramType).toBe('agent-pipeline');
    expect(payrecover?.engineeringDecisions?.length).toBeGreaterThanOrEqual(2);
    expect(payrecover?.challenges?.length).toBeGreaterThanOrEqual(2);

    // 2. RoadWatch AI
    const roadwatch = projectList.find((p) => p.slug === 'roadwatch-ai');
    expect(roadwatch).toBeDefined();
    expect(roadwatch?.name).toBe('RoadWatch AI');
    expect(roadwatch?.isFeatured).toBe(true);
    expect(roadwatch?.displayOrder).toBe(2);
    expect(roadwatch?.technologies).toContain('React');
    expect(roadwatch?.technologies).toContain('TypeScript');
    expect(roadwatch?.technologies).toContain('Google Gemini AI');
    expect(roadwatch?.architectureDiagramType).toBe('hazard-detection');

    // 3. StadiumX
    const stadiumX = projectList.find((p) => p.slug === 'stadium-x');
    expect(stadiumX).toBeDefined();
    expect(stadiumX?.name).toBe('StadiumX');
    expect(stadiumX?.isFeatured).toBe(true);
    expect(stadiumX?.displayOrder).toBe(3);
    expect(stadiumX?.technologies).toContain('React');
    expect(stadiumX?.technologies).toContain('REST API');
    expect(stadiumX?.architectureDiagramType).toBe('venue-grid');
  });

  it('validates every project complies strictly with Zod schema', () => {
    for (const project of projectList) {
      expect(() => ProjectSchema.parse(project)).not.toThrow();
      expect(project.githubUrl).toMatch(/^https:\/\/github\.com\/RANAPRINCE06\//);
      expect(project.verificationStatus).toBe('verified');
      expect(project.problemStatement.length).toBeGreaterThanOrEqual(10);
      expect(project.solution.length).toBeGreaterThanOrEqual(10);
      expect(project.architectureHighlights.length).toBeGreaterThanOrEqual(2);
      if (project.liveDemoUrl) {
        expect(project.liveDemoUrl).toMatch(/^https:\/\//);
      }
    }
  });

  it('validates all 4 category filters return non-empty verified projects', () => {
    // 1. All
    const allProjects = projectList;
    expect(allProjects.length).toBe(7);

    // 2. AI / Machine Learning
    const aiProjects = projectList.filter(
      (p) =>
        p.category === 'AI & Machine Learning' ||
        p.technologies.some((t) =>
          ['FastAPI', 'Gemini', 'Python', 'Google Gemini AI', 'Sentence-Transformers', 'spaCy'].includes(t)
        )
    );
    expect(aiProjects.length).toBeGreaterThanOrEqual(3);
    expect(aiProjects.some((p) => p.slug === 'payrecover-ai')).toBe(true);
    expect(aiProjects.some((p) => p.slug === 'roadwatch-ai')).toBe(true);

    // 3. Full Stack
    const fullStackProjects = projectList.filter(
      (p) =>
        p.category === 'Full-Stack Web' ||
        p.technologies.some((t) => ['React', 'Vite', 'Express.js', 'Firebase'].includes(t))
    );
    expect(fullStackProjects.length).toBeGreaterThanOrEqual(3);
    expect(fullStackProjects.some((p) => p.slug === 'stadium-x')).toBe(true);
    expect(fullStackProjects.some((p) => p.slug === 'roadwatch-ai')).toBe(true);

    // 4. Backend / Systems
    const backendProjects = projectList.filter(
      (p) =>
        p.category === 'Distributed Systems & Backend' ||
        p.technologies.some((t) =>
          ['FastAPI', 'Node.js', 'Express.js', 'Spring Boot', 'Kafka', 'Redis', 'PostgreSQL'].includes(t)
        )
    );
    expect(backendProjects.length).toBeGreaterThanOrEqual(3);
    expect(backendProjects.some((p) => p.slug === 'payrecover-ai')).toBe(true);
    expect(backendProjects.some((p) => p.slug === 'scalecart-microservices')).toBe(true);
  });
});

