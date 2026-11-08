import { describe, it, expect } from 'vitest';
import { GitHubRepoApiSchema } from '@/lib/github/schemas';
import { repositoryService, REPOSITORY_CURATION_MAP } from '@/lib/github/repository-service';

describe('GitHub Data Service & Curation Suite', () => {
  it('parses valid raw GitHub API repository responses', () => {
    const mockRawRepo = {
      id: 987654,
      name: 'ROADWATCH-AI',
      full_name: 'RANAPRINCE06/ROADWATCH-AI',
      description: 'Road safety platform',
      html_url: 'https://github.com/RANAPRINCE06/ROADWATCH-AI',
      homepage: 'https://roadwatch.vercel.app',
      stargazers_count: 5,
      forks_count: 1,
      language: 'TypeScript',
      topics: ['nextjs', 'ai', 'computer-vision'],
      archived: false,
      fork: false,
      updated_at: '2026-03-01T12:00:00Z',
    };

    const parsed = GitHubRepoApiSchema.parse(mockRawRepo);
    expect(parsed.name).toBe('ROADWATCH-AI');
    expect(parsed.stargazers_count).toBe(5);
    expect(parsed.language).toBe('TypeScript');
  });

  it('rejects malformed repository objects missing required ID or HTML URL', () => {
    const invalidRepo = {
      name: 'broken-repo',
      html_url: 'invalid-url-format',
    };
    expect(() => GitHubRepoApiSchema.parse(invalidRepo)).toThrow();
  });

  it('provides a reliable local fallback dataset when API is unreachable', () => {
    const fallback = repositoryService.getLocalFallbackRepositories();
    expect(fallback.length).toBeGreaterThanOrEqual(5);

    const roadwatch = fallback.find((r) => r.name === 'RoadWatch AI');
    expect(roadwatch).toBeDefined();
    expect(roadwatch?.isFeatured).toBe(true);
    expect(roadwatch?.url).toBe('https://github.com/RANAPRINCE06/ROADWATCH-AI');
  });

  it('correctly maps curated metadata and excludes hidden toy repositories', () => {
    expect(REPOSITORY_CURATION_MAP['ROADWATCH-AI'].isFeatured).toBe(true);
    expect(REPOSITORY_CURATION_MAP['ROADWATCH-AI'].isHidden).toBe(false);

    expect(REPOSITORY_CURATION_MAP['C-tutorial'].isHidden).toBe(true);
    expect(REPOSITORY_CURATION_MAP['Birthday'].isHidden).toBe(true);
    expect(REPOSITORY_CURATION_MAP['insta'].isHidden).toBe(true);
  });
});
