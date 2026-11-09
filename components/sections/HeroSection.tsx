'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Terminal,
  Cpu,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { personalProfile } from '@/content';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      aria-label="Introduction & Overview"
      className="relative flex min-h-[calc(100vh-8rem)] scroll-mt-28 flex-col justify-center pt-8 pb-16 md:pt-12"
    >
      {/* Anchor for About navigation target */}
      <div id="about" className="absolute top-0 -mt-28" aria-hidden="true" />

      {/* Grid container: On desktop, text occupies the left 7 columns to frame the central 3D CyberCore */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 lg:col-span-8 flex flex-col z-base">
          {/* Availability Status Indicator */}
          <div className="inline-flex self-start items-center gap-2.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-1.5 text-xs font-mono text-accent-cyan shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
            </span>
            <span className="font-semibold tracking-wider uppercase">
              SYSTEM ONLINE &bull; {personalProfile.status.availabilityNotice}
            </span>
          </div>

          {/* Main Developer Headline */}
          <div className="mt-8 flex flex-col gap-4">
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-text-primary sm:text-7xl md:text-8xl">
              <span className="block text-text-primary">Prince</span>
              <span className="block bg-gradient-to-r from-accent-cyan via-white to-accent-violet bg-clip-text text-transparent">
                Rana.
              </span>
            </h1>

            <p className="font-display text-xl font-medium tracking-tight text-text-secondary sm:text-2xl md:text-3xl max-w-2xl">
              Software Development Engineer &amp; Artificial Intelligence Specialist.
            </p>
          </div>

          {/* Verified Bio Overview */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {personalProfile.shortBio}
          </p>

          {/* Core CTA Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="#projects" variant="primary" size="lg">
              Explore Architecture
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button href="#contact" variant="secondary" size="lg">
              Get in Touch
              <Mail className="h-4 w-4" />
            </Button>
          </div>

          {/* Verified Developer Channels & Badges */}
          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-border-subtle/60 pt-6">
            <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
              Verified Profiles:
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://github.com/RANAPRINCE06"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-text-secondary transition-colors hover:text-accent-cyan"
                aria-label="GitHub Profile"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/prince-rana-0b622b32a"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-text-secondary transition-colors hover:text-accent-cyan"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://codeforces.com/profile/rana_prince.1806"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-text-secondary transition-colors hover:text-accent-cyan"
                aria-label="Codeforces Profile"
              >
                <Code2 className="h-4 w-4" />
                <span>Codeforces (1498)</span>
              </a>
              <a
                href="https://leetcode.com/u/RANA_PRINCE_06/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-text-secondary transition-colors hover:text-accent-cyan"
                aria-label="LeetCode Profile"
              >
                <Cpu className="h-4 w-4" />
                <span>LeetCode (400+)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Framing viewport area for CyberCore 3D Scene */}
        <div className="hidden md:flex md:col-span-5 lg:col-span-4 h-full min-h-[360px] pointer-events-none items-center justify-center" aria-hidden="true">
          {/* Subtle decorative target reticle indicating interactive 3D focal area */}
          <div className="relative h-64 w-64 rounded-full border border-accent-cyan/10 animate-pulse-slow flex items-center justify-center">
            <div className="h-48 w-48 rounded-full border border-accent-violet/10" />
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-text-muted">
        <span className="font-mono text-[10px] tracking-widest uppercase">SCROLL</span>
        <div className="h-8 w-4 rounded-full border border-border-subtle p-0.5 flex justify-center">
          <div className="h-2 w-1 rounded-full bg-accent-cyan animate-bounce" />
        </div>
      </div>
    </section>
  );
};

