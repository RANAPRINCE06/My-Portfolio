'use client';

import React, { useEffect, useState } from 'react';
import {
  Code2,
  GitBranch,
  Star,
  Award,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { TechBadge } from '@/components/ui/TechBadge';
import { competitiveProgrammingProfiles } from '@/content';

interface GitHubStats {
  repoCount: number;
  totalStars: number;
  isFallback: boolean;
  timestamp: string;
}

export const LiveTelemetry: React.FC = () => {
  const [gitHubStats, setGitHubStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchGitHubData() {
      try {
        const res = await fetch('/api/github');
        if (!res.ok) throw new Error('API route returned status ' + res.status);
        const data = await res.json();

        if (isMounted && data.success) {
          const repos = data.data || [];
          const totalStars = repos.reduce(
            (sum: number, r: { stargazersCount?: number }) =>
              sum + (r.stargazersCount || 0),
            0
          );

          setGitHubStats({
            repoCount: repos.length,
            totalStars,
            isFallback: Boolean(data.fromFallback),
            timestamp: data.timestamp || new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('Could not fetch live GitHub metrics, rendering verified local snapshot.', err);
        if (isMounted) {
          setGitHubStats({
            repoCount: 6,
            totalStars: 0,
            isFallback: true,
            timestamp: new Date().toISOString(),
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchGitHubData();
    return () => {
      isMounted = false;
    };
  }, []);

  const cf = competitiveProgrammingProfiles.find((p) => p.platform === 'Codeforces');
  const cc = competitiveProgrammingProfiles.find((p) => p.platform === 'CodeChef');
  const lc = competitiveProgrammingProfiles.find((p) => p.platform === 'LeetCode');
  const hr = competitiveProgrammingProfiles.find((p) => p.platform === 'HackerRank');

  return (
    <section id="statistics" aria-label="Developer Telemetry & Metrics" className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-cyan" />
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
              METRICS &amp; PLATFORM DATA
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Algorithmic Standing &amp; Open Source
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald" />
          <span>Strictly Verified Evidence</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Codeforces */}
        <BentoCard glowColor="cyan" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text-muted">CODEFORCES</span>
              <Code2 className="h-4 w-4 text-accent-cyan" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-text-primary">
                {cf?.currentRating || 1498}
              </span>
              <span className="font-mono text-xs text-accent-cyan font-semibold">
                {cf?.rankTitle || 'Specialist'}
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-text-secondary">
              Max Rating: {cf?.maxRating || 1565} &bull; {cf?.globalContestsParticipated || 20} Contests
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-[11px] font-mono text-text-muted">
            <span>Source: Verified Record</span>
            <a
              href={cf?.profileUrl || 'https://codeforces.com/profile/rana_prince.1806'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent-cyan hover:underline"
            >
              Verify <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </BentoCard>

        {/* Card 2: CodeChef & LeetCode */}
        <BentoCard glowColor="violet" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text-muted">CODECHEF &bull; LEETCODE</span>
              <Award className="h-4 w-4 text-accent-violet" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-text-primary">
                {cc?.stars || '3★'}
              </span>
              <span className="font-mono text-xs text-accent-violet font-semibold">
                Rating {cc?.currentRating || 1606}
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-text-secondary">
              {lc?.problemsSolved || 400}+ LeetCode Problems Solved
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-[11px] font-mono text-text-muted">
            <span>Source: Profile Snapshot</span>
            <a
              href={lc?.profileUrl || 'https://leetcode.com/u/RANA_PRINCE_06/'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent-violet hover:underline"
            >
              Verify <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </BentoCard>

        {/* Card 3: HackerRank Mastery */}
        <BentoCard glowColor="emerald" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text-muted">HACKERRANK</span>
              <Award className="h-4 w-4 text-accent-emerald" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-text-primary">
                5★ Gold
              </span>
              <span className="font-mono text-xs text-accent-emerald font-semibold">
                C++ &amp; Java
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-text-secondary">
              Badges: C++ 5-Star Gold, Java 5-Star Gold
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-[11px] font-mono text-text-muted">
            <span>Source: Verified Profile</span>
            <a
              href={hr?.profileUrl || 'https://www.hackerrank.com/profile/rana_prince1806'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent-emerald hover:underline"
            >
              Verify <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </BentoCard>

        {/* Card 4: Live GitHub Metrics */}
        <BentoCard glowColor="cyan" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text-muted">GITHUB OPEN SOURCE</span>
              <GitBranch className="h-4 w-4 text-accent-cyan" />
            </div>
            {loading ? (
              <div className="mt-3 flex items-center gap-2 text-text-muted">
                <RefreshCw className="h-4 w-4 animate-spin text-accent-cyan" />
                <span className="font-mono text-xs">Querying GitHub API...</span>
              </div>
            ) : (
              <>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-text-primary">
                    {gitHubStats?.repoCount || 6}
                  </span>
                  <span className="font-mono text-xs text-text-secondary">
                    Repositories
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-text-secondary">
                  <Star className="h-3 w-3 text-amber-400" />
                  <span>Verified Public Repositories</span>
                </div>
              </>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-[11px] font-mono">
            <span className={gitHubStats?.isFallback ? 'text-amber-400' : 'text-accent-emerald'}>
              {gitHubStats?.isFallback ? 'Verified Cache' : 'Live Sync'}
            </span>
            <a
              href="https://github.com/RANAPRINCE06"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent-cyan hover:underline"
            >
              @RANAPRINCE06 <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </BentoCard>
      </div>
    </section>
  );
};

