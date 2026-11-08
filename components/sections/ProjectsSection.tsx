'use client';

import React, { useState } from 'react';
import { Layers, Terminal, Sparkles } from 'lucide-react';
import { projectList } from '@/content';
import { ProjectCard } from '@/components/ui/ProjectCard';

const CATEGORIES = ['All', 'AI & Machine Learning', 'Full-Stack Web', 'Distributed Systems & Backend'];

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = projectList.filter((project) => {
    if (activeCategory === 'All') return true;
    return project.category === activeCategory;
  });

  return (
    <section id="projects" aria-label="Curated Engineering Projects" className="flex flex-col gap-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-cyan" />
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
              CURATED PRODUCTION &amp; RESEARCH ARCHITECTURES
            </span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Featured Systems &amp; Deployments
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Project Category Filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

