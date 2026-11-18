'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUp,
  Github,
  Linkedin,
  Code2,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { RoyalPRLogo } from '@/components/ui/RoyalPRLogo';
import { scrollToTarget } from '@/lib/scroll-bridge';

const FOOTER_SECTIONS = [
  {
    category: 'Architecture',
    links: [
      { label: '01 · About & Bio', href: '#about' },
      { label: '02 · Live Telemetry', href: '#statistics' },
      { label: '03 · Systems & Projects', href: '#projects' },
    ],
  },
  {
    category: 'Competencies',
    links: [
      { label: '04 · Skills Matrix', href: '#skills' },
      { label: '05 · Work Timeline', href: '#experience' },
      { label: '06 · Enterprise Simulations', href: '#simulations' },
    ],
  },
  {
    category: 'Verification',
    links: [
      { label: '07 · Contests & Standing', href: '#achievements' },
      { label: '08 · Verified Credentials', href: '#certifications' },
      { label: '09 · Transmission Dispatch', href: '#contact' },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    handle: '@RANAPRINCE06',
    url: 'https://github.com/RANAPRINCE06',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    handle: 'Prince Rana',
    url: 'https://www.linkedin.com/in/prince-rana-0b622b32a',
    icon: Linkedin,
  },
  {
    name: 'LeetCode',
    handle: 'Knight · 400+',
    url: 'https://leetcode.com/u/RANA_PRINCE_06/',
    icon: Code2,
  },
  {
    name: 'Codeforces',
    handle: 'Specialist · 1565',
    url: 'https://codeforces.com/profile/rana_prince.1806',
    icon: Terminal,
  },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget(0);
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToTarget(href, { offset: href === '#about' ? 0 : -104 });
  };

  return (
    <footer className="relative z-content border-t border-border-subtle/80 bg-background-secondary/70 pt-16 pb-12 px-6 backdrop-blur-2xl">
      {/* Subtle footer atmospheric top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent"
      />

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Top Header: Brand Identity & Back to Top */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border-subtle/70 pb-8">
          <div className="flex items-center gap-4">
            <RoyalPRLogo size={46} variant="footer" showGlow />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold tracking-tight text-text-primary">
                  PRINCE RANA
                </span>
                <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent-cyan font-semibold">
                  Royal PR
                </span>
              </div>
              <p className="font-mono text-xs text-text-muted mt-0.5">
                Software Development Engineer &bull; Artificial Intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleScrollToTop}
            className="group inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-border-subtle bg-background-glass px-3.5 py-2 font-mono text-xs text-text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-all duration-200"
            aria-label="Back to top of portfolio"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-1" />
          </button>
        </div>

        {/* Middle Navigation & Social Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Section Navigation Columns (3 cols) */}
          {FOOTER_SECTIONS.map((sec) => (
            <div key={sec.category} className="space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-semibold block">
                {sec.category}
              </span>
              <ul className="space-y-2">
                {sec.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleSectionClick(e, link.href)}
                      className="font-mono text-xs text-text-secondary hover:text-accent-cyan transition-colors block py-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Profiles Column */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1 lg:col-span-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-semibold block">
              Verified Developer Channels
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOCIAL_LINKS.map((soc) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={soc.name}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-border-subtle/70 bg-background-surface/40 p-2.5 font-mono text-xs text-text-secondary hover:border-accent-cyan hover:text-text-primary transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-accent-cyan" />
                      <span>{soc.name}</span>
                    </div>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent-cyan" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Engineering Telemetry & Legal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border-subtle/70 pt-8 font-mono text-xs text-text-muted">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">All systems nominal</span>
            </div>
            <span className="text-border-subtle">&bull;</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-accent-cyan" />
              <span>Next.js 14 &bull; React 18 &bull; Three.js &bull; GSAP</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span>&copy; {currentYear} Prince Rana. All rights reserved.</span>
            <span className="text-border-subtle">&bull;</span>
            <span className="text-text-muted">Vadodara, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
