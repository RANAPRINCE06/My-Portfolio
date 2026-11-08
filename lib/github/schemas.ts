import { z } from 'zod';

export const GitHubOwnerSchema = z.object({
  login: z.string(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
});

export const GitHubRepoApiSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string().url(),
  homepage: z.string().nullable().optional(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  language: z.string().nullable().optional(),
  topics: z.array(z.string()).optional().default([]),
  archived: z.boolean().default(false),
  fork: z.boolean().default(false),
  updated_at: z.string(),
  created_at: z.string().optional(),
  pushed_at: z.string().optional(),
  size: z.number().optional(),
  open_issues_count: z.number().optional(),
});

export type GitHubRepoApi = z.infer<typeof GitHubRepoApiSchema>;

export const GitHubUserApiSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  public_repos: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  created_at: z.string(),
});

export type GitHubUserApi = z.infer<typeof GitHubUserApiSchema>;

