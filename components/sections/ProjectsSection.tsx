'use client';

import React, { useEffect, useRef, useState } from 'react';
import { projectList } from '@/content';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CATEGORIES = ['All', 'AI & Machine Learning', 'Full-Stack Web', 'Distributed Systems & Backend'];

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasFilterChangedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const filteredProjects = projectList.filter((project) => {
    if (activeCategory === 'All') return true;
    return project.category === activeCategory;
  });

  // Initial ScrollTrigger choreography for Statistics -> Projects transition
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Section eyebrow reveal
      gsap.from('.projects-eyebrow', {
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

      // 2. Category filter tabs horizontal cascade
      gsap.from('.projects-filter-tab', {
        x: isMobile ? 0 : -14,
        y: isMobile ? 10 : 0,
        opacity: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: section,
          start: 'top 84%',
          once: true,
        },
      });

      // 3. Staggered depth-based entrance of ProjectCard articles
      gsap.from('.projects-grid > article', {
        y: isMobile ? 20 : 38,
        scale: isMobile ? 0.98 : 0.96,
        opacity: 0,
        duration: isMobile ? 0.45 : 0.7,
        stagger: isMobile ? 0.08 : 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 86%',
          once: true,
        },
      });

      // 4. Subtle desktop depth parallax on section atmospheric glow
      if (!isMobile) {
        gsap.fromTo(
          '.projects-depth-layer',
          { y: 24, opacity: 0.25 },
          {
            y: -24,
            opacity: 0.7,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'bottom 20%',
              scrub: 0.9,
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  // Smooth transition when filtering categories
  useEffect(() => {
    if (!hasFilterChangedRef.current) return;
    if (prefersReducedMotion || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(':scope > article');
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0.2, y: 16, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.38,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      }
    );
  }, [activeCategory, prefersReducedMotion]);

  const handleCategoryChange = (category: string) => {
    hasFilterChangedRef.current = true;
    setActiveCategory(category);
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Curated Engineering Projects"
      className="relative flex scroll-mt-28 flex-col gap-8"
    >
      {/* Subtle depth-parallax atmospheric glow */}
      <div
        aria-hidden="true"
        className="projects-depth-layer pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-35"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(0, 240, 255, 0.045) 0%, rgba(138, 43, 226, 0.03) 50%, transparent 78%)',
        }}
      />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="projects-eyebrow flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-cyan" />
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
              CURATED PRODUCTION &amp; RESEARCH ARCHITECTURES
            </span>
          </div>
          <SplitTextReveal
            text="Featured Systems & Deployments"
            as="h2"
            className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Project Category Filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`projects-filter-tab rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                activeCategory === cat
                  ? 'border border-accent-cyan/40 bg-accent-cyan/15 text-accent-cyan font-semibold shadow-sm'
                  : 'border border-border-subtle bg-background-surface/50 text-text-muted hover:text-text-primary hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div ref={gridRef} className="projects-grid grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            featured={index === 0 && activeCategory === 'All'}
          />
        ))}
      </div>
    </section>
  );
};
