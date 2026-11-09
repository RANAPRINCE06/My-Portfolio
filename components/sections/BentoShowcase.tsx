'use client';

import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Cpu,
  Layers,
  Award,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { TechBadge } from '@/components/ui/TechBadge';
import {
  educationList,
  professionalInternships,
  virtualJobSimulations,
  technicalSkillsList,
  hackathonList,
} from '@/content';

export const BentoShowcase: React.FC = () => {
  const edu = educationList[0];
  const hackathon = hackathonList[0];

  return (
    <section
      id="skills"
      aria-label="Skills & Verified Background"
      className="flex scroll-mt-28 flex-col gap-6"
    >
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-violet" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            EXPERTISE &amp; ACADEMICS
          </span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Core Competencies &amp; Experience Matrix
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Technical Stack Matrix (Col span 2) */}
        <BentoCard glowColor="cyan" className="flex flex-col justify-between sm:col-span-2">
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
                      <TechBadge key={s.name} variant="cyan" size="sm">
                        {s.name}
                      </TechBadge>
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
                      <TechBadge key={s.name} variant="muted" size="sm">
                        {s.name}
                      </TechBadge>
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
                      <TechBadge key={s.name} variant="violet" size="sm">
                        {s.name}
                      </TechBadge>
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
        <BentoCard glowColor="emerald" className="flex flex-col justify-between">
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
        <BentoCard glowColor="violet" className="flex flex-col justify-between sm:col-span-2 lg:col-span-1">
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

            <div className="mt-4 space-y-3">
              {professionalInternships.map((internship) => (
                <div key={internship.id} className="rounded-xl border border-border-subtle/60 bg-background-surface/30 p-3">
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
        <BentoCard glowColor="cyan" className="flex flex-col justify-between sm:col-span-2">
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

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {virtualJobSimulations.map((sim) => (
                <div key={sim.id} className="rounded-lg border border-border-subtle/70 bg-background-surface/20 p-2.5">
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
