'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Project } from '@/types/content';
import { TechBadge } from '@/components/ui/TechBadge';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  featured = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-background-glass/80 p-6 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-card-glass',
        featured && 'lg:col-span-2'
      )}
    >
      {/* Top Header: Category & Status */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle/70 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent-cyan font-medium uppercase tracking-wider">
              {project.category}
            </span>
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-cyan/15 px-2 py-0.5 text-[10px] font-mono text-accent-cyan">
                <Sparkles className="h-2.5 w-2.5" /> FEATURED
              </span>
            )}
          </div>
          <span className="rounded-full border border-border-subtle bg-background-surface/80 px-2.5 py-0.5 text-[11px] font-mono text-text-muted capitalize">
            Status: {project.status}
          </span>
        </div>

        {/* Project Title & Short Description */}
        <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-text-primary group-hover:text-accent-cyan transition-colors">
          {project.name}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
          {project.shortDescription}
        </p>

        {/* Tech Stack Badges */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {project.technologies.slice(0, expanded ? undefined : 6).map((tech) => (
            <TechBadge key={tech} variant="muted" size="sm">
              {tech}
            </TechBadge>
          ))}
          {!expanded && project.technologies.length > 6 && (
            <span className="text-[11px] font-mono text-text-muted">
              +{project.technologies.length - 6} more
            </span>
          )}
        </div>

        {/* Expandable Architectural Details */}
        {expanded && (
          <div className="mt-6 space-y-4 rounded-xl border border-border-subtle/80 bg-background-surface/40 p-4 font-body text-xs">
            <div>
              <span className="font-mono font-semibold text-accent-cyan uppercase tracking-wider block mb-1">
                Problem Statement
              </span>
              <p className="text-text-secondary leading-relaxed">
                {project.problemStatement}
              </p>
            </div>
            <div>
              <span className="font-mono font-semibold text-accent-cyan uppercase tracking-wider block mb-1">
                Engineered Solution
              </span>
              <p className="text-text-secondary leading-relaxed">
                {project.solution}
              </p>
            </div>
            {project.architectureHighlights && (
              <div>
                <span className="font-mono font-semibold text-accent-cyan uppercase tracking-wider block mb-1.5">
                  Key Architectural Highlights
                </span>
                <ul className="list-disc list-inside space-y-1 text-text-secondary">
                  {project.architectureHighlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-2 border-t border-border-subtle/60 text-[11px] font-mono text-text-muted">
              Evidence: {project.evidenceSource}
            </div>
          </div>
        )}
      </div>

      {/* Footer Links & Architecture Details Button */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle/70 pt-4">
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-background-surface/60 px-3 py-1.5 text-xs font-mono text-text-primary transition-all hover:border-accent-cyan hover:text-accent-cyan hover:bg-accent-cyan/10"
              aria-label={`View ${project.name} source code on GitHub`}
            >
              <Github className="h-3.5 w-3.5" />
              <span>Source</span>
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-1.5 text-xs font-mono font-medium text-accent-cyan transition-all hover:border-accent-cyan hover:bg-accent-cyan/20"
              aria-label={`Open ${project.name} live deployment`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Demo</span>
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 text-xs font-mono text-text-secondary hover:text-accent-cyan transition-colors"
          aria-expanded={expanded}
        >
          <span>{expanded ? 'Hide Details' : 'Architecture'}</span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </article>
  );
};

