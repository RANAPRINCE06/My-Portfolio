'use client';

import React, { useEffect, useRef } from 'react';
import {
  Trophy,
  ExternalLink,
  Code2,
  Terminal,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  competitiveProgrammingProfiles,
  achievementList,
} from '@/content';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';

export const AchievementsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const cf = competitiveProgrammingProfiles.find((p) => p.platform === 'Codeforces');
  const cc = competitiveProgrammingProfiles.find((p) => p.platform === 'CodeChef');
  const lc = competitiveProgrammingProfiles.find((p) => p.platform === 'LeetCode');
  const hr = competitiveProgrammingProfiles.find((p) => p.platform === 'HackerRank');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.ach-eyebrow', {
        y: 14,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: section,
          start: 'top 86%',
          once: true,
        },
      });

      gsap.from('.ach-telemetry-card', {
        y: 20,
        scale: 0.98,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.ach-telemetry-grid',
          start: 'top 88%',
          once: true,
        },
      });

      gsap.from('.ach-honor-card', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.ach-honors-grid',
          start: 'top 88%',
          once: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      aria-label="Competitive Programming & Notable Achievements"
      className="relative flex scroll-mt-28 flex-col gap-8"
    >
      {/* Subtle depth-parallax atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 40% 50%, rgba(251, 191, 36, 0.05) 0%, rgba(0, 240, 255, 0.03) 50%, transparent 80%)',
        }}
      />

      {/* Section Header */}
      <div>
        <div className="ach-eyebrow flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            ALGORITHMIC DEPTH &bull; CONTEST STANDINGS
          </span>
        </div>
        <SplitTextReveal
          text="Competitive Programming &amp; Notable Achievements"
          as="h2"
          className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
        />
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Verified contest ratings, algorithmic problem-solving milestones, and ICPC-style programming competition
          achievements across international platforms.
        </p>
      </div>

      {/* 1. Competitive Programming Platform Dashboard Cards */}
      <div className="ach-telemetry-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Codeforces */}
        {cf && (
          <div className="ach-telemetry-card group rounded-2xl border border-border-subtle bg-background-glass/90 p-5 backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan/50 hover:shadow-card-glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan">
                  <Terminal className="h-3.5 w-3.5" />
                </div>
                <span className="font-mono text-xs font-semibold text-text-primary">Codeforces</span>
              </div>
              <span className="rounded-full bg-accent-cyan/10 px-2 py-0.5 font-mono text-[10px] text-accent-cyan border border-accent-cyan/30 font-medium">
                {cf.rankTitle}
              </span>
            </div>
            <div className="mt-3.5 font-display text-3xl font-bold text-text-primary tracking-tight">
              {cf.maxRating}{' '}
              <span className="text-xs font-normal text-text-muted font-mono">Max Rating</span>
            </div>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              Current: <span className="text-accent-cyan font-semibold">{cf.currentRating}</span> &bull; Handle: {cf.handle}
            </p>
            <div className="mt-4 pt-2.5 border-t border-border-subtle/60 flex justify-between items-center text-[10px] font-mono text-text-muted">
              <span>Verified Snapshot</span>
              <a
                href={cf.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-cyan hover:underline inline-flex items-center gap-1 font-medium"
              >
                Profile <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        )}

        {/* CodeChef */}
        {cc && (
          <div className="ach-telemetry-card group rounded-2xl border border-border-subtle bg-background-glass/90 p-5 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/50 hover:shadow-card-glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-400">
                  <Code2 className="h-3.5 w-3.5" />
                </div>
                <span className="font-mono text-xs font-semibold text-text-primary">CodeChef</span>
              </div>
              <span className="rounded-full bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] text-amber-400 border border-amber-400/30 font-medium">
                {cc.stars} Coder
              </span>
            </div>
            <div className="mt-3.5 font-display text-3xl font-bold text-text-primary tracking-tight">
              {cc.currentRating}{' '}
              <span className="text-xs font-normal text-text-muted font-mono">Rating</span>
            </div>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              Global Starters &bull; Handle: {cc.handle}
            </p>
            <div className="mt-4 pt-2.5 border-t border-border-subtle/60 flex justify-between items-center text-[10px] font-mono text-text-muted">
              <span>Verified Snapshot</span>
              <a
                href={cc.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                Profile <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        )}

        {/* LeetCode */}
        {lc && (
          <div className="ach-telemetry-card group rounded-2xl border border-border-subtle bg-background-glass/90 p-5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/50 hover:shadow-card-glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
                <span className="font-mono text-xs font-semibold text-text-primary">LeetCode</span>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-400/30 font-medium">
                Knight Tier
              </span>
            </div>
            <div className="mt-3.5 font-display text-3xl font-bold text-text-primary tracking-tight">
              {lc.problemsSolved}{' '}
              <span className="text-xs font-normal text-text-muted font-mono">Solved</span>
            </div>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              50 &bull; 100 Days Badges &bull; Handle: {lc.handle}
            </p>
            <div className="mt-4 pt-2.5 border-t border-border-subtle/60 flex justify-between items-center text-[10px] font-mono text-text-muted">
              <span>Verified Snapshot</span>
              <a
                href={lc.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                Profile <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        )}

        {/* HackerRank */}
        {hr && (
          <div className="ach-telemetry-card group rounded-2xl border border-border-subtle bg-background-glass/90 p-5 backdrop-blur-xl transition-all duration-300 hover:border-accent-violet/50 hover:shadow-card-glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent-violet/30 bg-accent-violet/10 text-accent-violet">
                  <Award className="h-3.5 w-3.5" />
                </div>
                <span className="font-mono text-xs font-semibold text-text-primary">HackerRank</span>
              </div>
              <span className="rounded-full bg-accent-violet/10 px-2 py-0.5 font-mono text-[10px] text-accent-violet border border-accent-violet/30 font-medium">
                5★ Gold
              </span>
            </div>
            <div className="mt-3.5 font-display text-3xl font-bold text-text-primary tracking-tight">
              C++ &amp; Java{' '}
              <span className="text-xs font-normal text-text-muted font-mono">Proficiency</span>
            </div>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              5-Star Gold Badges &bull; Handle: {hr.handle}
            </p>
            <div className="mt-4 pt-2.5 border-t border-border-subtle/60 flex justify-between items-center text-[10px] font-mono text-text-muted">
              <span>Verified Snapshot</span>
              <a
                href={hr.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-violet hover:underline inline-flex items-center gap-1 font-medium"
              >
                Profile <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 2. Notable Achievements & Competition Honors Grid */}
      <div className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Competition Standings &amp; Milestones ({achievementList.length})</span>
        </h3>

        <div className="ach-honors-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievementList.map((ach) => (
            <div
              key={ach.id}
              className="ach-honor-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-background-glass/90 p-5 md:p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/50 hover:shadow-card-glass"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border-subtle/70 pb-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                    {ach.category}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted">
                    {ach.date}
                  </span>
                </div>

                <h4 className="mt-3.5 font-display text-lg font-bold text-text-primary group-hover:text-amber-400 transition-colors">
                  {ach.title}
                </h4>

                {ach.metric && (
                  <div className="mt-2 inline-block rounded-md bg-amber-400/10 px-2.5 py-1 font-mono text-xs text-amber-400 border border-amber-400/30 font-semibold">
                    {ach.metric}
                  </div>
                )}

                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border-subtle/60 flex items-center justify-between font-mono text-[11px]">
                <span className="text-text-muted">{ach.organization}</span>
                {ach.proofUrl && (
                  <a
                    href={ach.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-amber-400 hover:underline font-semibold"
                    aria-label={`View proof for ${ach.title}`}
                  >
                    <span>Verification</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
