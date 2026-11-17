'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Github,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Code2,
} from 'lucide-react';
import { Project } from '@/types/content';
import { TechBadge } from '@/components/ui/TechBadge';
import { ProjectVisual } from '@/components/ui/ProjectVisual';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation & accessibility focus trap
  useEffect(() => {
    if (!isOpen || !project || !mounted) return;

    // Focus close button on mount
    closeButtonRef.current?.focus();

    // Lock body scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, project, mounted, onClose]);

  if (!mounted || !isOpen || !project) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      aria-describedby="modal-project-desc"
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop with Cyberpunk Radial Atmosphere & Blur */}
      <div
        className="fixed inset-0 bg-background-primary/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-accent-cyan/30 bg-background-secondary/95 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(0, 240, 255, 0.15)',
        }}
      >
        {/* Modal Sticky Header Bar */}
        <div className="flex items-center justify-between border-b border-border-subtle/80 bg-background-glass px-6 py-4 backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-accent-cyan font-medium">
              {project.category}
            </span>
            <span className="text-text-muted text-xs">{'//'}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-3 w-3" /> VERIFIED SPEC
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="rounded-lg border border-border-subtle bg-background-surface/80 p-1.5 text-text-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 space-y-8">
          {/* Architectural Schematic Header */}
          <ProjectVisual
            type={project.architectureDiagramType || 'agent-pipeline'}
            projectName={project.name}
            isModalHeader={true}
          />

          {/* Project Title & Status */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                id="modal-project-title"
                className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
              >
                {project.name}
              </h2>
              <span className="rounded-full border border-border-subtle bg-background-surface px-3 py-1 font-mono text-xs text-text-muted capitalize">
                Lifecycle: {project.status}
              </span>
            </div>

            <p id="modal-project-desc" className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {project.detailedOverview}
            </p>
          </div>

          {/* Problem Statement & Engineered Solution */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:p-5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>Problem Statement</span>
              </div>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-text-secondary">
                {project.problemStatement}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Engineered Solution</span>
              </div>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-text-secondary">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Key Architectural Highlights */}
          {project.architectureHighlights && project.architectureHighlights.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent-cyan">
                <Layers className="h-4 w-4" />
                <span>System Architecture Highlights</span>
              </h3>
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {project.architectureHighlights.map((hl, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-border-subtle/80 bg-background-surface/40 p-3 text-xs text-text-secondary"
                  >
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-cyan" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Engineering Decisions & Rationale */}
          {project.engineeringDecisions && project.engineeringDecisions.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent-violet">
                <Cpu className="h-4 w-4" />
                <span>Key Engineering Decisions &amp; Trade-offs</span>
              </h3>
              <div className="space-y-2">
                {project.engineeringDecisions.map((dec, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-accent-violet/20 bg-accent-violet/5 p-3.5 text-xs leading-relaxed text-text-secondary"
                  >
                    <span className="font-mono text-accent-violet font-semibold mr-1.5">
                      DECISION #{idx + 1}:
                    </span>
                    {dec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Challenges & Implementation Details */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Code2 className="h-4 w-4" />
                <span>Technical Challenges &amp; Mitigations</span>
              </h3>
              <div className="space-y-2">
                {project.challenges.map((ch, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3.5 text-xs leading-relaxed text-text-secondary"
                  >
                    <span className="font-mono text-amber-400 font-semibold mr-1.5">
                      CHALLENGE #{idx + 1}:
                    </span>
                    {ch}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Technology Stack */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
              Verified Production Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <TechBadge key={tech} variant="cyan" size="sm">
                  {tech}
                </TechBadge>
              ))}
            </div>
          </div>

          {/* Evidence Source & Verification Statement */}
          <div className="rounded-lg border border-border-subtle/60 bg-background-glass p-3.5 font-mono text-[11px] text-text-muted">
            <span className="text-text-primary font-semibold">Evidence Attribution: </span>
            {project.evidenceSource}
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle/80 bg-background-glass px-6 py-4 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-background-surface/80 px-4 py-2 font-mono text-xs text-text-primary transition-all hover:border-accent-cyan hover:bg-accent-cyan/10 hover:text-accent-cyan"
              >
                <Github className="h-4 w-4" />
                <span>View Source Code</span>
              </a>
            )}

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-accent-cyan/50 bg-accent-cyan/20 px-4 py-2 font-mono text-xs font-semibold text-accent-cyan transition-all hover:border-accent-cyan hover:bg-accent-cyan/30"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Verified Live Demo</span>
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-subtle px-4 py-2 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary hover:border-white/20"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
