'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Code2,
  Layout,
  Server,
  Database,
  Bot,
  Cloud,
  Wrench,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { technicalSkillsList } from '@/content/skills';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { TechnicalSkill } from '@/types/content';

interface SkillCategoryMeta {
  id: string;
  name: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose' | 'sky' | 'fuchsia';
  borderColor: string;
  bgColor: string;
  accentTextColor: string;
  description: string;
}

const CATEGORIES: SkillCategoryMeta[] = [
  {
    id: 'Programming Languages',
    name: 'Programming Languages',
    label: 'Languages',
    icon: Code2,
    color: 'cyan',
    borderColor: 'border-accent-cyan/40',
    bgColor: 'bg-accent-cyan/10',
    accentTextColor: 'text-accent-cyan',
    description: 'Core systems programming and object-oriented languages for robust, high-performance software.',
  },
  {
    id: 'Frontend Development',
    name: 'Frontend Development',
    label: 'Frontend',
    icon: Layout,
    color: 'emerald',
    borderColor: 'border-accent-emerald/40',
    bgColor: 'bg-accent-emerald/10',
    accentTextColor: 'text-accent-emerald',
    description: 'Modern component-driven web interfaces, reactive state paradigms, and responsive design systems.',
  },
  {
    id: 'Backend Development',
    name: 'Backend Development',
    label: 'Backend',
    icon: Server,
    color: 'violet',
    borderColor: 'border-accent-violet/40',
    bgColor: 'bg-accent-violet/10',
    accentTextColor: 'text-accent-violet',
    description: 'Scalable service architectures, RESTful API design, and asynchronous request processing pipelines.',
  },
  {
    id: 'Databases',
    name: 'Databases',
    label: 'Databases',
    icon: Database,
    color: 'amber',
    borderColor: 'border-amber-400/40',
    bgColor: 'bg-amber-400/10',
    accentTextColor: 'text-amber-400',
    description: 'Relational ACID persistence, document-store data modeling, and low-latency in-memory caching.',
  },
  {
    id: 'AI & Machine Learning',
    name: 'AI & Machine Learning',
    label: 'AI & ML',
    icon: Bot,
    color: 'rose',
    borderColor: 'border-rose-400/40',
    bgColor: 'bg-rose-400/10',
    accentTextColor: 'text-rose-400',
    description: 'NLP transformer embeddings, semantic entity recognition, and generative AI orchestration.',
  },
  {
    id: 'Cloud & DevOps',
    name: 'Cloud & DevOps',
    label: 'Cloud / DevOps',
    icon: Cloud,
    color: 'sky',
    borderColor: 'border-sky-400/40',
    bgColor: 'bg-sky-400/10',
    accentTextColor: 'text-sky-400',
    description: 'Containerization, continuous integration workflows, cloud primitives, and Linux systems tooling.',
  },
  {
    id: 'Developer Tools',
    name: 'Developer Tools',
    label: 'Dev Tools',
    icon: Wrench,
    color: 'fuchsia',
    borderColor: 'border-fuchsia-400/40',
    bgColor: 'bg-fuchsia-400/10',
    accentTextColor: 'text-fuchsia-400',
    description: 'Enterprise IDE environments, API debugging suites, and diagnostic productivity instruments.',
  },
];

export const SkillsSection: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('Programming Languages');
  const sectionRef = useRef<HTMLElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const hasFilterChangedRef = useRef(false);

  const activeMeta = CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];

  // Filter skills based on selected category (mapping 'AI & Machine Learning' to 'AI / Machine Learning' if needed)
  const currentSkills = technicalSkillsList.filter((s) => {
    if (activeCategoryId === 'AI & Machine Learning') {
      return s.category === 'AI & Machine Learning' || s.category === 'AI / Machine Learning';
    }
    return s.category === activeCategoryId;
  });

  // Computer Science core fundamentals for complementary bottom panel
  const csFundamentals = technicalSkillsList.filter(
    (s) => s.category === 'Core Computer Science'
  );

  // Initial ScrollTrigger entrance animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.from('.skills-eyebrow', {
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

      gsap.from('.skills-tab-button', {
        x: isMobile ? 0 : -12,
        y: isMobile ? 8 : 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.skills-tab-list',
          start: 'top 88%',
          once: true,
        },
      });

      gsap.from('.skills-grid-item', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.skills-grid-container',
          start: 'top 86%',
          once: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  // Animated card transition when switching categories
  useEffect(() => {
    if (!hasFilterChangedRef.current || prefersReducedMotion || !cardsGridRef.current) return;

    const cards = cardsGridRef.current.querySelectorAll('.skills-grid-item');
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0.2, y: 12, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        stagger: 0.04,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      }
    );
  }, [activeCategoryId, prefersReducedMotion]);

  const handleCategorySelect = (categoryId: string) => {
    hasFilterChangedRef.current = true;
    setActiveCategoryId(categoryId);
  };

  const getProficiencyBadge = (proficiency: TechnicalSkill['proficiency']) => {
    switch (proficiency) {
      case 'advanced':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 uppercase font-semibold">
            <CheckCircle2 className="h-2.5 w-2.5" /> Advanced
          </span>
        );
      case 'proficient':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 font-mono text-[10px] text-accent-cyan uppercase font-medium">
            Proficient
          </span>
        );
      case 'intermediate':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-background-surface/80 px-2 py-0.5 font-mono text-[10px] text-text-muted uppercase">
            Intermediate
          </span>
        );
      case 'familiar':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-background-surface/50 px-2 py-0.5 font-mono text-[10px] text-text-muted/80 uppercase">
            Familiar
          </span>
        );
    }
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Technical Skills & Competencies"
      className="relative flex scroll-mt-28 flex-col gap-8"
    >
      {/* Subtle depth-parallax atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 70% 35%, rgba(138, 43, 226, 0.05) 0%, rgba(0, 240, 255, 0.04) 50%, transparent 80%)',
        }}
      />

      {/* Section Header */}
      <div>
        <div className="skills-eyebrow flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-cyan" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            ENGINEERING CAPABILITIES &bull; PRODUCTION STACK
          </span>
        </div>
        <SplitTextReveal
          text="Technical Stack & Expertise Matrix"
          as="h2"
          className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
        />
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Structured inventory of verified engineering tools, systems programming languages, distributed backend
          frameworks, and ML libraries validated through real production codebases and competitive programming.
        </p>
      </div>

      {/* Interactive Technology Category Tabs */}
      <div
        role="tablist"
        aria-label="Skills Category Selector"
        className="skills-tab-list flex flex-wrap gap-2 border-b border-border-subtle/80 pb-3"
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isSelected}
              aria-label={cat.name}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={cn(
                'skills-tab-button group flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs transition-all duration-200 select-none',
                isSelected
                  ? cn(cat.borderColor, cat.bgColor, cat.accentTextColor, 'font-semibold shadow-sm')
                  : 'border-border-subtle bg-background-glass/80 text-text-muted hover:border-white/20 hover:text-text-primary'
              )}
            >
              <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="hidden md:inline">{cat.name}</span>
              <span className="md:hidden">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Category Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border-subtle/80 bg-background-glass p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm',
              activeMeta.borderColor,
              activeMeta.bgColor,
              activeMeta.accentTextColor
            )}
          >
            <activeMeta.icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-text-primary">
              {activeMeta.name}
            </h3>
            <p className="text-xs text-text-secondary leading-normal">
              {activeMeta.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[11px] text-text-muted">
          <span className="rounded bg-background-surface px-2 py-0.5 border border-border-subtle text-accent-cyan font-semibold">
            {currentSkills.length} Verified Tools
          </span>
          <span className="text-emerald-400">&bull; Active Scope</span>
        </div>
      </div>

      {/* Dynamic Technology Explorer Cards Grid */}
      <div
        ref={cardsGridRef}
        className="skills-grid-container grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {currentSkills.map((skill) => (
          <div
            key={skill.name}
            className="skills-grid-item group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-subtle/80 bg-background-glass/90 p-4 backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-card-glass"
          >
            {/* Subtle Top Glowing Line on Hover */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                  {skill.category}
                </span>
                {skill.highlight && (
                  <span
                    title="Core Primary Competency"
                    className="inline-flex items-center gap-0.5 text-amber-400"
                  >
                    <Sparkles className="h-3 w-3" />
                  </span>
                )}
              </div>

              <h4 className="font-display text-base font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                {skill.name}
              </h4>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border-subtle/60 pt-2.5">
              <span className="font-mono text-[10px] text-text-muted">Standard</span>
              {getProficiencyBadge(skill.proficiency)}
            </div>
          </div>
        ))}
      </div>

      {/* Core Computer Science Fundamentals Panel */}
      {csFundamentals.length > 0 && (
        <div className="mt-4 rounded-2xl border border-border-subtle/80 bg-background-surface/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-border-subtle/60 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent-violet" />
              <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
                Core Computer Science Fundamentals
              </span>
            </div>
            <span className="font-mono text-[10px] text-accent-violet">
              Academic &bull; Parul University B.Tech AI
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {csFundamentals.map((cs) => (
              <div
                key={cs.name}
                className="flex items-center justify-between rounded-lg border border-border-subtle/70 bg-background-glass px-3 py-2 text-xs text-text-secondary"
              >
                <span className="font-medium text-text-primary">{cs.name}</span>
                <span className="font-mono text-[10px] text-accent-violet font-semibold uppercase">
                  {cs.proficiency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
