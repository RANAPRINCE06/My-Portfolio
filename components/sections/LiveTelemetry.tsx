'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Code2,
  GitBranch,
  Star,
  Award,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
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

  const sectionRef = useRef<HTMLElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Telemetry section label reveal
      gsap.from('.telemetry-label', {
        x: -18,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: section,
          start: 'top 86%',
          once: true,
        },
      });

      // 2. Staggered metric cards entrance
      gsap.from('.telemetry-card', {
        y: isMobile ? 16 : 26,
        scale: 0.97,
        opacity: 0,
        duration: isMobile ? 0.4 : 0.55,
        stagger: isMobile ? 0.06 : 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.telemetry-grid',
          start: 'top 90%',
          once: true,
        },
      });

      // 3. Verified metric number count-up animations
      const counters = section.querySelectorAll<HTMLElement>('[data-countup]');
      counters.forEach((el) => {
        const target = Number(el.dataset.countup || 0);
        if (!target) return;
        const obj = { value: 0 };
        gsap.to(obj, {
          value: target,
          duration: isMobile ? 0.9 : 1.35,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.telemetry-grid',
            start: 'top 86%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.value));
          },
        });
      });

      // 4. Subtle ambient background lighting sweep
      if (ambientRef.current && !isMobile) {
        gsap.fromTo(
          ambientRef.current,
          { opacity: 0.25, scale: 0.94 },
          {
            opacity: 0.85,
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'bottom 30%',
              scrub: 0.8,
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="statistics"
      aria-label="Developer Telemetry & Metrics"
      className="relative flex scroll-mt-28 flex-col gap-6"
    >
      {/* Subtle section-specific ambient glow */}
      <div
        ref={ambientRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(0, 240, 255, 0.055) 0%, rgba(16, 185, 129, 0.025) 45%, transparent 75%)',
        }}
      />

      {/* Anchor for Achievements navigation target */}
      <div id="achievements" className="absolute top-0 -mt-28" aria-hidden="true" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="telemetry-label flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-cyan" />
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
              METRICS &amp; PLATFORM DATA
            </span>
          </div>
          <SplitTextReveal
            text="Algorithmic Standing & Open Source"
            as="h2"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          />
        </div>
        <div className="telemetry-label flex items-center gap-2 text-xs font-mono text-text-muted">
          <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald" />
          <span>Strictly Verified Evidence</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="telemetry-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Codeforces */}
        <BentoCard glowColor="cyan" className="telemetry-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text-muted">CODEFORCES</span>
              <Code2 className="h-4 w-4 text-accent-cyan" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span
                className="font-display text-3xl font-bold text-text-primary tabular-nums"
                data-countup={cf?.currentRating || 1498}
              >
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
        <BentoCard glowColor="violet" className="telemetry-card flex flex-col justify-between">
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
                Rating{' '}
                <span className="tabular-nums" data-countup={cc?.currentRating || 1606}>
                  {cc?.currentRating || 1606}
                </span>
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-text-secondary">
              <span className="tabular-nums" data-countup={lc?.problemsSolved || 400}>
                {lc?.problemsSolved || 400}
              </span>
              + LeetCode Problems Solved
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
        <BentoCard glowColor="emerald" className="telemetry-card flex flex-col justify-between">
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
        <BentoCard glowColor="cyan" className="telemetry-card flex flex-col justify-between">
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

