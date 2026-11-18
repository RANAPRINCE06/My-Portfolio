'use client';

import React, { useEffect, useRef } from 'react';
import {
  Layers,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { virtualJobSimulations } from '@/content';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';

export const SimulationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.sim-eyebrow', {
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

      gsap.from('.sim-card', {
        y: 22,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.sim-grid',
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
      id="simulations"
      aria-label="Enterprise Virtual Job Simulations"
      className="relative flex scroll-mt-28 flex-col gap-8"
    >
      {/* Subtle depth-parallax atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 70% 50%, rgba(138, 43, 226, 0.05) 0%, rgba(0, 240, 255, 0.03) 50%, transparent 80%)',
        }}
      />

      {/* Section Header */}
      <div>
        <div className="sim-eyebrow flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-violet animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            VIRTUAL EXPERIENCE &bull; ENTERPRISE SIMULATIONS
          </span>
        </div>
        <SplitTextReveal
          text="Enterprise Virtual Job Simulations"
          as="h2"
          className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
        />
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Rigorous open-access simulation programs replicating real-world enterprise engineering workflows,
          system architectures, and technical problem-solving. Verified via The Forage.
        </p>
      </div>

      {/* Explicit Distinction Callout Banner */}
      <div className="rounded-xl border border-accent-violet/30 bg-accent-violet/5 p-4 font-mono text-xs text-text-secondary leading-relaxed backdrop-blur-md">
        <div className="flex items-center gap-2 text-accent-violet font-semibold uppercase tracking-wider mb-1">
          <Layers className="h-4 w-4" />
          <span>INDUSTRY VIRTUAL JOB SIMULATIONS ({virtualJobSimulations.length})</span>
        </div>
        <span className="text-text-muted text-[11px] block sm:inline">
          NOTE: These are structured corporate simulation projects designed by enterprise engineering teams (not direct
          employment). Each completed program is backed by an authentic cryptographic verification certificate.
        </span>
      </div>

      {/* Responsive Simulations Card Grid */}
      <div className="sim-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {virtualJobSimulations.map((sim) => (
          <div
            key={sim.id}
            className="sim-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-background-glass/90 p-5 md:p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent-violet/50 hover:shadow-card-glass hover:-translate-y-1"
          >
            <div>
              {/* Header: Organization and Date */}
              <div className="flex items-center justify-between border-b border-border-subtle/70 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent-violet/30 bg-accent-violet/10 text-accent-violet">
                    <Building2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-display text-sm font-bold text-text-primary">
                    {sim.company}
                  </span>
                </div>
                <span className="flex items-center gap-1 font-mono text-[10px] text-accent-violet">
                  <Calendar className="h-3 w-3" />
                  {sim.startDate}
                </span>
              </div>

              {/* Simulation Title */}
              <h3 className="mt-3.5 font-display text-base font-bold text-text-primary group-hover:text-accent-violet transition-colors">
                {sim.role}
              </h3>

              {/* Description Bullets */}
              <ul className="mt-2.5 space-y-1.5 text-xs text-text-secondary leading-relaxed">
                {sim.description.map((d, i) => (
                  <li key={i} className="line-clamp-3">
                    &bull; {d}
                  </li>
                ))}
              </ul>

              {/* Skills / Technologies */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {sim.technologies.map((t) => (
                  <TechBadge key={t} variant="muted" size="sm">
                    {t}
                  </TechBadge>
                ))}
              </div>
            </div>

            {/* Verification Footer Link */}
            {sim.verificationUrl && (
              <div className="mt-5 pt-3 border-t border-border-subtle/60 flex items-center justify-between font-mono text-[11px]">
                <span className="text-text-muted flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-violet" />
                  Verified Simulation
                </span>
                <a
                  href={sim.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-accent-violet hover:underline"
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
    </section>
  );
};

