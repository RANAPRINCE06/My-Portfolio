import { GitHubRepoApi, GitHubRepoApiSchema, GitHubUserApi, GitHubUserApiSchema } from './schemas';

const GITHUB_API_BASE = 'https://api.github.com';
const USERNAME = 'RANAPRINCE06';

export interface GitHubClientOptions {
  token?: string;
  timeoutMs?: number;
}

export class GitHubClient {
  private token?: string;
  private timeoutMs: number;

  constructor(options?: GitHubClientOptions) {
    // Keep access token server-side; defaults to env variable if present
    this.token = options?.token || process.env.GITHUB_ACCESS_TOKEN;
    this.timeoutMs = options?.timeoutMs || 8000;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Prince-Rana-Portfolio',
    };
    if (this.token && this.token.trim() !== '') {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  /**
   * Fetches public repositories for the candidate with pagination support.
   */
  async getRepositories(page: number = 1, perPage: number = 100): Promise<{
    data: GitHubRepoApi[];
    rateLimitRemaining: number | null;
    rateLimitReset: number | null;
  }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const url = `${GITHUB_API_BASE}/users/${USERNAME}/repos?sort=updated&per_page=${perPage}&page=${page}`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal,
        next: { revalidate: 3600 }, // Cache on server for 1 hour
      });

      const rateLimitRemaining = response.headers.get('x-ratelimit-remaining')
        ? parseInt(response.headers.get('x-ratelimit-remaining')!, 10)
        : null;
      const rateLimitReset = response.headers.get('x-ratelimit-reset')
        ? parseInt(response.headers.get('x-ratelimit-reset')!, 10)
        : null;

      if (!response.ok) {
        if (response.status === 403) {
          console.warn('GitHub API rate limit exceeded or forbidden.');
        } else {
          console.warn(`GitHub API request failed with status: ${response.status}`);
        }
        return { data: [], rateLimitRemaining, rateLimitReset };
      }

      const json = await response.json();
      if (!Array.isArray(json)) {
        return { data: [], rateLimitRemaining, rateLimitReset };
      }

      const validatedRepos: GitHubRepoApi[] = [];
      for (const item of json) {
        const parsed = GitHubRepoApiSchema.safeParse(item);
        if (parsed.success) {
          validatedRepos.push(parsed.data);
        }
      }

      return { data: validatedRepos, rateLimitRemaining, rateLimitReset };
    } catch (error) {
      console.error('Error fetching repositories from GitHub API:', error);
      return { data: [], rateLimitRemaining: null, rateLimitReset: null };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Fetches candidate's public GitHub user profile.
   */
  async getUserProfile(): Promise<GitHubUserApi | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const url = `${GITHUB_API_BASE}/users/${USERNAME}`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal,
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        return null;
      }

      const json = await response.json();
      const parsed = GitHubUserApiSchema.safeParse(json);
      return parsed.success ? parsed.data : null;
    } catch (error) {
      console.error('Error fetching user profile from GitHub API:', error);
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const githubClient = new GitHubClient();
