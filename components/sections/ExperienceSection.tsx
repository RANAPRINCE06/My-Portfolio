'use client';

import React, { useEffect, useRef } from 'react';
import {
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Calendar,
  MapPin,
} from 'lucide-react';
import {
  professionalInternships,
  educationList,
} from '@/content';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';

export const ExperienceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const edu = educationList[0];

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

      gsap.from('.exp-education-card', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.exp-education-card',
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
      id="experience"
      aria-label="Professional Experience & Career Timeline"
      className="relative flex scroll-mt-28 flex-col gap-8"
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
          <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            CAREER &amp; INDUSTRY &bull; VERIFIED TIMELINE
          </span>
        </div>
        <SplitTextReveal
          text="Professional Experience &amp; Education"
          as="h2"
          className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
        />
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Chronological record of verified software engineering internships and academic credentials in Computer
          Science &amp; Engineering.
        </p>
      </div>

      {/* Section Content */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-border-subtle/80 bg-background-glass p-4 font-mono text-xs text-text-muted">
          <span className="flex items-center gap-2 text-text-primary font-semibold">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            VERIFIED INDUSTRY INTERNSHIPS ({professionalInternships.length})
          </span>
          <span className="text-text-muted text-[11px]">Strictly separated from simulation coursework</span>
        </div>

        {/* Timeline Container */}
        <div className="exp-timeline-container relative pl-6 md:pl-8 before:absolute before:left-2 md:before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-accent-cyan before:via-accent-violet before:to-transparent space-y-8">
          {professionalInternships.map((internship) => (
            <div
              key={internship.id}
              className="exp-timeline-item relative group flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-background-glass/90 p-6 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-card-glass hover:-translate-y-1"
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                      {internship.company}
                    </h3>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400 font-semibold uppercase">
                      Verified
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

                {/* Key Contributions list */}
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
                    Tech Stack:
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
          <div className="exp-education-card mt-8 rounded-2xl border border-border-subtle/80 bg-background-glass p-6 md:p-8 backdrop-blur-xl">
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
    </section>
  );
};
