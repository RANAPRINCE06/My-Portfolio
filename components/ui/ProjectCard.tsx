'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  ExternalLink,
  Github,
  Sparkles,
  Layers,
  ArrowUpRight,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Project } from '@/types/content';
import { TechBadge } from '@/components/ui/TechBadge';
import { ProjectVisual } from '@/components/ui/ProjectVisual';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  onSelect?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  featured = false,
  onSelect,
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [inlineExpanded, setInlineExpanded] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();
  const [canHover, setCanHover] = useState<boolean>(false);

  // Check for mouse/fine pointer capability (disable 3D tilt on mobile touch devices)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      setCanHover(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!cardRef.current || !canHover || prefersReducedMotion) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setCoords({ x, y });

      // Calculate subtle 3D tilt: max 6 degrees
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      setTilt({ rotateX, rotateY });
    },
    [canHover, prefersReducedMotion]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    // If the click is directly on an anchor or button, let that element handle it
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    if (onSelect) {
      onSelect(project);
    }
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        transform:
          canHover && !prefersReducedMotion && isHovered
            ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(4px)`
            : undefined,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-background-glass/90 p-6 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-card-glass cursor-pointer',
        featured && 'lg:col-span-2'
      )}
    >
      {/* Dynamic Cursor Spotlight (Desktop hover only) */}
      {isHovered && canHover && !prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, rgba(0, 240, 255, 0.09), transparent 75%)`,
          }}
        />
      )}

      {/* Cyberpunk Top Glowing Accent Line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Card Content Top Block */}
      <div className="relative z-content space-y-4">
        {/* Top Header: Category, Featured Pill, Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle/70 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-accent-cyan font-medium">
              {project.category}
            </span>
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-cyan/15 px-2 py-0.5 text-[10px] font-mono text-accent-cyan border border-accent-cyan/30">
                <Sparkles className="h-2.5 w-2.5" /> FEATURED
              </span>
            )}
          </div>

          <span className="rounded-full border border-border-subtle bg-background-surface/80 px-2.5 py-0.5 text-[11px] font-mono text-text-muted capitalize">
            Status: {project.status}
          </span>
        </div>

        {/* Abstract Architectural Schematic Header */}
        <ProjectVisual
          type={project.architectureDiagramType || 'agent-pipeline'}
          projectName={project.name}
        />

        {/* Title & Short Description */}
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-text-primary group-hover:text-accent-cyan transition-colors sm:text-2xl flex items-center justify-between">
            <span>{project.name}</span>
            <ArrowUpRight className="h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-cyan" />
          </h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-text-secondary">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {project.technologies.slice(0, 6).map((tech) => (
            <TechBadge key={tech} variant="muted" size="sm">
              {tech}
            </TechBadge>
          ))}
          {project.technologies.length > 6 && (
            <span className="text-[11px] font-mono text-text-muted">
              +{project.technologies.length - 6} more
            </span>
          )}
        </div>

        {/* Optional Inline Details Toggle for quick inspection without opening modal */}
        {inlineExpanded && (
          <div className="mt-4 space-y-3 rounded-xl border border-border-subtle/80 bg-background-surface/60 p-4 font-body text-xs">
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
                <span className="font-mono font-semibold text-accent-cyan uppercase tracking-wider block mb-1">
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

      {/* Footer Actions */}
      <div className="relative z-content mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle/70 pt-4">
        {/* Deep Dive Action (Primary) */}
        <button
          type="button"
          onClick={() => onSelect && onSelect(project)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-1.5 text-xs font-mono font-medium text-accent-cyan transition-all hover:bg-accent-cyan/20 hover:border-accent-cyan"
          aria-label={`Open architecture modal for ${project.name}`}
        >
          <Maximize2 className="h-3 w-3" />
          <span>Deep Dive Spec</span>
        </button>

        {/* External Links & Inline Toggle */}
        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-background-surface/80 px-2.5 py-1 text-xs font-mono text-text-secondary transition-colors hover:border-accent-cyan hover:text-accent-cyan"
              aria-label={`View ${project.name} source code on GitHub`}
            >
              <Github className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Source</span>
            </a>
          )}

          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-background-surface/80 px-2.5 py-1 text-xs font-mono text-text-secondary transition-colors hover:border-accent-cyan hover:text-accent-cyan"
              aria-label={`Open ${project.name} live deployment`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Demo</span>
            </a>
          )}

          {/* Quick inline accordion button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setInlineExpanded(!inlineExpanded);
            }}
            className="inline-flex items-center p-1.5 text-text-muted hover:text-text-primary transition-colors rounded"
            aria-expanded={inlineExpanded}
            aria-label={inlineExpanded ? 'Hide inline details' : 'Show inline details'}
          >
            {inlineExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>
  );
};
