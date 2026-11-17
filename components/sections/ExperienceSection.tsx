'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Briefcase,
  Layers,
  Award,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Trophy,
  Terminal,
  Code2,
  Sparkles,
} from 'lucide-react';
import {
  professionalInternships,
  virtualJobSimulations,
  educationList,
  certificationList,
  achievementList,
  competitiveProgrammingProfiles,
} from '@/content';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export const ExperienceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'timeline' | 'simulations' | 'certifications' | 'achievements'>('timeline');

  const edu = educationList[0];
  const cf = competitiveProgrammingProfiles.find((p) => p.platform === 'Codeforces');
  const cc = competitiveProgrammingProfiles.find((p) => p.platform === 'CodeChef');
  const lc = competitiveProgrammingProfiles.find((p) => p.platform === 'LeetCode');
  const hr = competitiveProgrammingProfiles.find((p) => p.platform === 'HackerRank');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.exp-eyebrow', {
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

      gsap.from('.exp-timeline-item', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.exp-timeline-container',
          start: 'top 86%',
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
      id="experience"
      aria-label="Professional Experience & Verified Credentials"
      className="relative flex scroll-mt-28 flex-col gap-10"
    >
      {/* Subtle depth-parallax atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 30% 50%, rgba(0, 240, 255, 0.04) 0%, rgba(138, 43, 226, 0.05) 50%, transparent 80%)',
        }}
      />

      {/* Section Header */}
      <div>
        <div className="exp-eyebrow flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-violet" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            CAREER &amp; CREDENTIALS &bull; VERIFIED TIMELINE
          </span>
        </div>
        <SplitTextReveal
          text="Engineering Experience & Achievements"
          as="h2"
          className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
        />
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Chronological record of verified professional software engineering internships, enterprise virtual job
          simulations, competitive programming contest standings, and industry credentials.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        role="tablist"
        aria-label="Experience Sub-Sections"
        className="flex flex-wrap gap-2 border-b border-border-subtle/80 pb-3"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'timeline'}
          onClick={() => setActiveTab('timeline')}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs transition-all duration-200 select-none',
            activeTab === 'timeline'
              ? 'border-accent-cyan/40 bg-accent-cyan/15 text-accent-cyan font-semibold shadow-sm'
              : 'border-border-subtle bg-background-glass text-text-muted hover:border-white/20 hover:text-text-primary'
          )}
        >
          <Briefcase className="h-4 w-4" />
          <span>Professional Internships ({professionalInternships.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'simulations'}
          onClick={() => setActiveTab('simulations')}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs transition-all duration-200 select-none',
            activeTab === 'simulations'
              ? 'border-accent-violet/40 bg-accent-violet/15 text-accent-violet font-semibold shadow-sm'
              : 'border-border-subtle bg-background-glass text-text-muted hover:border-white/20 hover:text-text-primary'
          )}
        >
          <Layers className="h-4 w-4" />
          <span>Enterprise Simulations ({virtualJobSimulations.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'achievements'}
          onClick={() => setActiveTab('achievements')}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs transition-all duration-200 select-none',
            activeTab === 'achievements'
              ? 'border-amber-400/40 bg-amber-400/15 text-amber-400 font-semibold shadow-sm'
              : 'border-border-subtle bg-background-glass text-text-muted hover:border-white/20 hover:text-text-primary'
          )}
        >
          <Trophy className="h-4 w-4" />
          <span>Contests &amp; Achievements ({achievementList.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'certifications'}
          onClick={() => setActiveTab('certifications')}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs transition-all duration-200 select-none',
            activeTab === 'certifications'
              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 font-semibold shadow-sm'
              : 'border-border-subtle bg-background-glass text-text-muted hover:border-white/20 hover:text-text-primary'
          )}
        >
          <Award className="h-4 w-4" />
          <span>Certifications &amp; Badges ({certificationList.length})</span>
        </button>
      </div>

      {/* 1. PROFESSIONAL INTERNSHIPS TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-border-subtle/80 bg-background-glass p-4 font-mono text-xs text-text-muted">
            <span className="flex items-center gap-2 text-text-primary font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              VERIFIED PROFESSIONAL INTERNSHIPS
            </span>
            <span className="text-text-muted">Strictly separated from simulation coursework</span>
          </div>

          <div className="exp-timeline-container relative pl-6 md:pl-8 before:absolute before:left-2 md:before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-accent-cyan before:via-accent-violet before:to-transparent space-y-8">
            {professionalInternships.map((internship) => (
              <div
                key={internship.id}
                className="exp-timeline-item relative group flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-background-glass/90 p-6 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-card-glass"
              >
                {/* Timeline Node Reticle Indicator */}
                <div
                  aria-hidden="true"
                  className="absolute -left-6 md:-left-8 top-7 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-accent-cyan bg-background-primary transition-transform group-hover:scale-125 group-hover:border-accent-cyan group-hover:shadow-[0_0_12px_rgba(0,240,255,0.8)]"
                />

                <div>
                  {/* Header: Company, Dates, Role */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle/70 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                        {internship.company}
                      </h3>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400 font-semibold uppercase">
                        Verified Internship
                      </span>
                    </div>

                    <div className="flex items-center gap-4 font-mono text-xs text-text-muted">
                      <span className="flex items-center gap-1.5 text-accent-cyan font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {internship.startDate} &ndash; {internship.endDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {internship.location}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 font-mono text-sm font-semibold text-accent-violet">
                    {internship.role}
                  </p>

                  {/* Responsibilities list */}
                  <ul className="mt-4 space-y-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {internship.description.map((desc, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-cyan" />
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technology Focus Badges */}
                  <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-border-subtle/60">
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider mr-1">
                      Tech Focus:
                    </span>
                    {internship.technologies.map((tech) => (
                      <TechBadge key={tech} variant="cyan" size="sm">
                        {tech}
                      </TechBadge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Foundation Card */}
          {edu && (
            <div className="mt-8 rounded-2xl border border-border-subtle/80 bg-background-glass p-6 md:p-8 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle/70 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-emerald/40 bg-accent-emerald/10 text-accent-emerald">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-text-primary">
                      {edu.institution}
                    </h3>
                    <p className="font-mono text-xs text-accent-emerald">
                      {edu.degree} &bull; Specialization: {edu.specialization}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="rounded-full bg-accent-emerald/15 px-3 py-1 font-bold text-accent-emerald border border-accent-emerald/30">
                    CGPA {edu.cgpa}
                  </span>
                  <span className="text-text-muted">
                    {edu.startYear} &ndash; {edu.endYear}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                  Core Engineering Coursework
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {edu.coursework.join(' • ')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. ENTERPRISE VIRTUAL JOB SIMULATIONS */}
      {activeTab === 'simulations' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent-violet/30 bg-accent-violet/5 p-4 font-mono text-xs text-text-secondary leading-relaxed">
            <div className="flex items-center gap-2 text-accent-violet font-semibold uppercase tracking-wider mb-1">
              <Layers className="h-4 w-4" />
              <span>INDUSTRY VIRTUAL JOB SIMULATIONS (THE FORAGE)</span>
            </div>
            Rigorous open-access simulation programs replicating real-world enterprise engineering workflows, system
            architectures, and technical problem-solving. Each entry includes verified certificate proof links.
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {virtualJobSimulations.map((sim) => (
              <div
                key={sim.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-subtle bg-background-glass p-5 backdrop-blur-xl transition-all duration-300 hover:border-accent-violet/40 hover:shadow-card-glass"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border-subtle/70 pb-2.5">
                    <span className="font-display text-sm font-bold text-text-primary">
                      {sim.company}
                    </span>
                    <span className="font-mono text-[10px] text-accent-violet">
                      {sim.startDate}
                    </span>
                  </div>

                  <h4 className="mt-3 font-mono text-xs font-semibold text-text-primary group-hover:text-accent-violet transition-colors">
                    {sim.role}
                  </h4>

                  <ul className="mt-2.5 space-y-1.5 text-xs text-text-secondary leading-relaxed">
                    {sim.description.map((d, i) => (
                      <li key={i} className="line-clamp-3">
                        &bull; {d}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {sim.technologies.map((t) => (
                      <TechBadge key={t} variant="muted" size="sm">
                        {t}
                      </TechBadge>
                    ))}
                  </div>
                </div>

                {sim.verificationUrl && (
                  <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-text-muted">The Forage Verified</span>
                    <a
                      href={sim.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-accent-violet hover:underline"
                      aria-label={`View ${sim.company} simulation completion certificate`}
                    >
                      <span>Certificate</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CONTESTS & NOTABLE ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Competitive Programming Platform Telemetry Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Codeforces */}
            {cf && (
              <div className="rounded-xl border border-border-subtle bg-background-glass p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-muted">Codeforces</span>
                  <span className="rounded bg-accent-cyan/10 px-2 py-0.5 font-mono text-[10px] text-accent-cyan border border-accent-cyan/30">
                    {cf.rankTitle}
                  </span>
                </div>
                <div className="mt-3 font-display text-2xl font-bold text-text-primary">
                  {cf.maxRating}{' '}
                  <span className="text-xs font-normal text-text-muted">Max Rating</span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-text-secondary">
                  Current: {cf.currentRating} &bull; Handle: {cf.handle}
                </p>
                <div className="mt-3 pt-2 border-t border-border-subtle/60 flex justify-between items-center text-[10px] font-mono text-text-muted">
                  <span>Verified Snapshot</span>
                  <a
                    href={cf.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-cyan hover:underline inline-flex items-center gap-1"
                  >
                    Profile <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            )}

            {/* CodeChef */}
            {cc && (
              <div className="rounded-xl border border-border-subtle bg-background-glass p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-muted">CodeChef</span>
                  <span className="rounded bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] text-amber-400 border border-amber-400/30">
                    {cc.stars} Coder
                  </span>
                </div>
                <div className="mt-3 font-display text-2xl font-bold text-text-primary">
                  {cc.currentRating}{' '}
                  <span className="text-xs font-normal text-text-muted">Rating</span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-text-secondary">
                  Global Starters &bull; Handle: {cc.handle}
                </p>
                <div className="mt-3 pt-2 border-t border-border-subtle/60 flex justify-between items-center text-[10px] font-mono text-text-muted">
                  <span>Verified Snapshot</span>
                  <a
                    href={cc.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    Profile <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            )}

            {/* LeetCode */}
            {lc && (
              <div className="rounded-xl border border-border-subtle bg-background-glass p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-muted">LeetCode</span>
                  <span className="rounded bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-400/30">
                    Knight Tier
                  </span>
                </div>
                <div className="mt-3 font-display text-2xl font-bold text-text-primary">
                  {lc.problemsSolved}{' '}
                  <span className="text-xs font-normal text-text-muted">Problems Solved</span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-text-secondary">
                  50 &bull; 100 Days Badges &bull; Handle: {lc.handle}
                </p>
                <div className="mt-3 pt-2 border-t border-border-subtle/60 flex justify-between items-center text-[10px] font-mono text-text-muted">
                  <span>Verified Snapshot</span>
                  <a
                    href={lc.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    Profile <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            )}

            {/* HackerRank */}
            {hr && (
              <div className="rounded-xl border border-border-subtle bg-background-glass p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-muted">HackerRank</span>
                  <span className="rounded bg-accent-violet/10 px-2 py-0.5 font-mono text-[10px] text-accent-violet border border-accent-violet/30">
                    5★ Gold
                  </span>
                </div>
                <div className="mt-3 font-display text-2xl font-bold text-text-primary">
                  C++ &amp; Java{' '}
                  <span className="text-xs font-normal text-text-muted">Gold Badges</span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-text-secondary">
                  Language Proficiency &bull; Handle: {hr.handle}
                </p>
                <div className="mt-3 pt-2 border-t border-border-subtle/60 flex justify-between items-center text-[10px] font-mono text-text-muted">
                  <span>Verified Snapshot</span>
                  <a
                    href={hr.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-violet hover:underline inline-flex items-center gap-1"
                  >
                    Profile <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Notable Achievements Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievementList.map((ach) => (
              <div
                key={ach.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-subtle bg-background-glass p-5 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/40 hover:shadow-card-glass"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border-subtle/70 pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                      {ach.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted">
                      {ach.date}
                    </span>
                  </div>

                  <h4 className="mt-3 font-display text-base font-bold text-text-primary group-hover:text-amber-400 transition-colors">
                    {ach.title}
                  </h4>

                  {ach.metric && (
                    <div className="mt-1.5 inline-block rounded bg-background-surface px-2 py-0.5 font-mono text-[11px] text-accent-cyan border border-border-subtle">
                      {ach.metric}
                    </div>
                  )}

                  <p className="mt-2.5 text-xs text-text-secondary leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-text-muted">{ach.organization}</span>
                  {ach.proofUrl && (
                    <a
                      href={ach.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                      aria-label={`View proof for ${ach.title}`}
                    >
                      <span>Verification</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INDUSTRY CERTIFICATIONS */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificationList.map((cert) => (
              <div
                key={cert.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-subtle bg-background-glass p-5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:shadow-card-glass"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border-subtle/70 pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                      {cert.issuerCategory}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted">
                      {cert.issueDate}
                    </span>
                  </div>

                  <h4 className="mt-3 font-display text-base font-bold text-text-primary group-hover:text-emerald-400 transition-colors">
                    {cert.title}
                  </h4>

                  <p className="mt-1 font-mono text-xs text-text-secondary">
                    Issuer: {cert.issuer}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {cert.skillsVerified.map((sk) => (
                      <span
                        key={sk}
                        className="rounded bg-background-surface px-1.5 py-0.5 font-mono text-[10px] text-text-muted border border-border-subtle/60"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center justify-between font-mono text-[10px] text-text-muted">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="h-3 w-3" /> VERIFIED
                  </span>
                  <span>Credentials Matrix</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
