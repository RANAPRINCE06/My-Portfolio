'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { certificationList } from '@/content';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export const CertificationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories extracted dynamically from verified data
  const categories = ['All', 'Cloud & Enterprise', 'Technology', 'Financial Services', 'Academic'];

  const filteredCerts = selectedCategory === 'All'
    ? certificationList
    : certificationList.filter((c) => c.issuerCategory === selectedCategory);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.cert-eyebrow', {
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

      gsap.from('.cert-card', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.cert-grid',
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
      id="certifications"
      aria-label="Verified Certifications & Industry Badges"
      className="relative flex scroll-mt-28 flex-col gap-8"
    >
      {/* Subtle depth-parallax atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(16, 185, 129, 0.04) 0%, rgba(0, 240, 255, 0.03) 50%, transparent 80%)',
        }}
      />

      {/* Section Header */}
      <div>
        <div className="cert-eyebrow flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            ACCREDITATIONS &bull; TECHNICAL PROFICIENCY
          </span>
        </div>
        <SplitTextReveal
          text="Verified Certifications &amp; Credentials"
          as="h2"
          className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
        />
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Comprehensive catalog of 16 industry-recognized cloud architecture, artificial intelligence,
          software engineering, and systems certifications.
        </p>
      </div>

      {/* Category Filter Pills & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle/80 pb-3">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Certification Categories">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' ? certificationList.length : certificationList.filter((c) => c.issuerCategory === cat).length;
            return (
              <button
                key={cat}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'rounded-xl border px-3 py-1.5 font-mono text-xs transition-all duration-200 select-none flex items-center gap-1.5',
                  isSelected
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 font-semibold shadow-sm'
                    : 'border-border-subtle bg-background-glass text-text-muted hover:border-white/20 hover:text-text-primary'
                )}
              >
                <span>{cat}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>{certificationList.length} Authenticated Badges</span>
        </div>
      </div>

      {/* Certifications Responsive Grid */}
      <div className="cert-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCerts.map((cert) => (
          <div
            key={cert.id}
            className="cert-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-background-glass/90 p-5 md:p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-card-glass"
          >
            <div>
              {/* Card Header: Category & Date */}
              <div className="flex items-center justify-between border-b border-border-subtle/70 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                  {cert.issuerCategory}
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  {cert.issueDate}
                </span>
              </div>

              {/* Title & Issuer */}
              <h3 className="mt-3.5 font-display text-base font-bold text-text-primary group-hover:text-emerald-400 transition-colors">
                {cert.title}
              </h3>

              <p className="mt-1 font-mono text-xs text-text-secondary flex items-center gap-1">
                <span className="text-text-muted">Issuer:</span>
                <span className="font-semibold text-text-primary">{cert.issuer}</span>
              </p>

              {/* Skills Verified Tags */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {cert.skillsVerified.map((sk) => (
                  <span
                    key={sk}
                    className="rounded bg-background-surface/80 px-2 py-0.5 font-mono text-[10px] text-text-secondary border border-border-subtle/60"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer: Credential Link / Verification Status */}
            <div className="mt-5 pt-3 border-t border-border-subtle/60 flex items-center justify-between font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>

              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                  aria-label={`View verified credential for ${cert.title}`}
                >
                  <span>Credential</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-text-muted text-[10px]">Academic Record</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

