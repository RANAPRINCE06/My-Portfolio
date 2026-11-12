'use client';

import React, { useEffect, useRef } from 'react';
import {
  GraduationCap,
  Briefcase,
  Cpu,
  Layers,
} from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { TechBadge } from '@/components/ui/TechBadge';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  educationList,
  professionalInternships,
  virtualJobSimulations,
  technicalSkillsList,
} from '@/content';

export const BentoShowcase: React.FC = () => {
  const edu = educationList[0];
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Header eyebrow reveal
      gsap.from('.bento-eyebrow', {
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

      // 2. Directional assembly of top Bento cards
      gsap.from('.bento-card-left', {
        x: isMobile ? 0 : -22,
        y: isMobile ? 18 : 22,
        opacity: 0,
        duration: isMobile ? 0.45 : 0.65,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.bento-grid',
          start: 'top 86%',
          once: true,
        },
      });

      gsap.from('.bento-card-right', {
        x: isMobile ? 0 : 22,
        y: isMobile ? 18 : 22,
        opacity: 0,
        duration: isMobile ? 0.45 : 0.65,
        delay: isMobile ? 0.06 : 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.bento-grid',
          start: 'top 86%',
          once: true,
        },
      });

      gsap.from('.bento-card-bottom', {
        y: isMobile ? 18 : 28,
        scale: 0.98,
        opacity: 0,
        duration: isMobile ? 0.45 : 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.bento-card-bottom',
          start: 'top 88%',
          once: true,
        },
      });

      // 3. Progressive technology badge cascade
      gsap.from('.bento-tech-badge', {
        scale: 0.88,
        opacity: 0,
        duration: 0.35,
        stagger: isMobile ? 0.02 : { amount: 0.45, from: 'start' },
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.bento-card-left',
          start: 'top 84%',
          once: true,
        },
      });

      // 4. Sequential internship timeline reveal
      gsap.from('.bento-internship-item', {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.16,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.bento-internships-list',
          start: 'top 88%',
          once: true,
        },
      });

      // 5. Simulation credential matrix reveal
      gsap.from('.bento-sim-item', {
        y: 14,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.bento-sims-grid',
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
      id="skills"
      aria-label="Skills & Verified Background"
      className="relative flex scroll-mt-28 flex-col gap-6"
    >
      {/* Section Header */}
      <div>
        <div className="bento-eyebrow flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-violet" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            EXPERTISE &amp; ACADEMICS
          </span>
        </div>
        <SplitTextReveal
          text="Core Competencies & Experience Matrix"
          as="h2"
          className="mt-2 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
        />
      </div>

      {/* Bento Grid */}
      <div className="bento-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Technical Stack Matrix (Col span 2) */}
        <BentoCard glowColor="cyan" className="bento-card-left flex flex-col justify-between sm:col-span-2">
          <div>
            <div className="flex items-center justify-between border-b border-border-subtle/70 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-accent-cyan" />
                <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Technical Architecture Stack
                </span>
              </div>
              <span className="font-mono text-[11px] text-accent-cyan">
                {technicalSkillsList.length}+ Verified Skills
              </span>
            </div>

            {/* Categorized Pills */}
            <div className="mt-4 space-y-3">
              <div>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-1.5">
                  Languages &amp; Core Systems
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {technicalSkillsList
                    .filter((s) => s.category === 'Programming Languages')
                    .map((s) => (
                      <span key={s.name} className="bento-tech-badge inline-flex">
                        <TechBadge variant="cyan" size="sm">
                          {s.name}
                        </TechBadge>
                      </span>
                    ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-1.5">
                  Frameworks &amp; Distributed Backends
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {technicalSkillsList
                    .filter(
                      (s) =>
                        s.category === 'Frontend Development' ||
                        s.category === 'Backend Development' ||
                        s.category === 'Databases'
                    )
                    .slice(0, 8)
                    .map((s) => (
                      <span key={s.name} className="bento-tech-badge inline-flex">
                        <TechBadge variant="muted" size="sm">
                          {s.name}
                        </TechBadge>
                      </span>
                    ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-1.5">
                  AI, NLP &amp; Cloud Infrastructure
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {technicalSkillsList
                    .filter(
                      (s) =>
                        s.category === 'AI / Machine Learning' ||
                        s.category === 'Cloud & DevOps' ||
                        s.category === 'Developer Tools'
                    )
                    .slice(0, 8)
                    .map((s) => (
                      <span key={s.name} className="bento-tech-badge inline-flex">
                        <TechBadge variant="violet" size="sm">
                          {s.name}
                        </TechBadge>
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-[11px] font-mono text-text-muted">
            <span>Validated with GitHub and Resume Artifacts</span>
            <span className="text-accent-cyan">Production Ready</span>
          </div>
        </BentoCard>

        {/* Card 2: Academic Credential */}
        <BentoCard glowColor="emerald" className="bento-card-right flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border-subtle/70 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-accent-emerald" />
                <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Academic Foundation
                </span>
              </div>
              <span className="rounded-full bg-accent-emerald/10 px-2 py-0.5 font-mono text-[10px] text-accent-emerald font-semibold">
                CGPA 7.96
              </span>
            </div>

            <div className="mt-4">
              <h3 className="font-display text-lg font-bold text-text-primary">
                {edu?.institution || 'Parul University'}
              </h3>
              <p className="mt-0.5 text-xs text-accent-emerald font-mono">
                {edu?.degree}
              </p>
              <p className="mt-1 font-mono text-xs text-text-muted">
                Specialization: {edu?.specialization} &bull; 2024 &ndash; 2028
              </p>

              <div className="mt-3 space-y-1">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                  Core Coursework
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Data Structures, OOP (C++/Java), DBMS, Operating Systems, Computer Networks, AI &amp; ML
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-[11px] font-mono text-text-muted">
            <span>Location: Vadodara, India</span>
            <span className="text-accent-emerald">Verified</span>
          </div>
        </BentoCard>

        {/* Card 3: Professional Internships */}
        <BentoCard glowColor="violet" className="bento-card-bottom flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between border-b border-border-subtle/70 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent-violet" />
                <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Professional Internships
                </span>
              </div>
              <span className="font-mono text-[10px] text-accent-violet">2 Roles</span>
            </div>

            <div className="bento-internships-list mt-4 space-y-3">
              {professionalInternships.map((internship) => (
                <div key={internship.id} className="bento-internship-item rounded-xl border border-border-subtle/60 bg-background-surface/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-text-primary">
                      {internship.company}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted">
                      {internship.startDate} &ndash; {internship.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-accent-violet font-mono mt-0.5">
                    {internship.role}
                  </p>
                  <p className="mt-1 text-[11px] text-text-secondary leading-normal">
                    {internship.description[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-border-subtle pt-3 text-[11px] font-mono text-text-muted">
            Separated from virtual simulations
          </div>
        </BentoCard>

        {/* Card 4: Virtual Job Simulations (The Forage) */}
        <BentoCard glowColor="cyan" className="bento-card-bottom flex flex-col justify-between sm:col-span-2">
          <div>
            <div className="flex items-center justify-between border-b border-border-subtle/70 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-accent-cyan" />
                <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Industry Job Simulations (The Forage)
                </span>
              </div>
              <span className="font-mono text-[10px] text-accent-cyan">
                {virtualJobSimulations.length} Enterprise Credentials
              </span>
            </div>

            <div className="bento-sims-grid mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {virtualJobSimulations.map((sim) => (
                <div key={sim.id} className="bento-sim-item rounded-lg border border-border-subtle/70 bg-background-surface/20 p-2.5">
                  <span className="font-display text-xs font-bold text-text-primary block">
                    {sim.company}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted block mt-0.5 truncate">
                    {sim.role}
                  </span>
                  <span className="font-mono text-[9px] text-accent-cyan/80 block mt-1">
                    {sim.startDate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-[11px] font-mono text-text-muted">
            <span>Credentials verifiable via Forage verification portals</span>
            <span className="text-accent-cyan">100% Verified</span>
          </div>
        </BentoCard>
      </div>
    </section>
  );
};

