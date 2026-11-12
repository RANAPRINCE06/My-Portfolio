'use client';

import React, { useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Cpu,
  Mail,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MagneticWrapper } from '@/components/ui/MagneticWrapper';
import { personalProfile } from '@/content';
import { gsap } from '@/lib/gsap';
import { scrollToTarget } from '@/lib/scroll-bridge';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const HeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Animation target refs
  const pillRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const designationRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const targets = [
        pillRef.current,
        headlineRef.current,
        designationRef.current,
        bioRef.current,
        ctasRef.current,
        socialsRef.current,
        scrollIndicatorRef.current,
        hudRef.current,
      ].filter(Boolean);

      gsap.set(targets, { opacity: 0, y: isMobile ? 16 : 24 });

      tl
        .to(pillRef.current, { opacity: 1, y: 0, duration: 0.55 }, 0.15)
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.4)
        .to(hudRef.current, { opacity: 1, y: 0, duration: 0.6 }, 1.0)
        .to(designationRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.9)
        .to(bioRef.current, { opacity: 1, y: 0, duration: 0.55 }, 1.1)
        .to(ctasRef.current, { opacity: 1, y: 0, duration: 0.5 }, 1.3)
        .to(socialsRef.current, { opacity: 1, y: 0, duration: 0.5 }, 1.5)
        .to(scrollIndicatorRef.current, { opacity: 1, y: 0, duration: 0.4 }, 1.8);

      // Subtle scroll-linked transition out from Hero -> Statistics (desktop only)
      if (!isMobile && hudRef.current) {
        gsap.to(hudRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }

      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          y: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '15% top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Introduction &amp; Overview"
      className="relative flex min-h-[calc(100vh-4rem)] scroll-mt-28 flex-col justify-center pt-8 pb-20 md:pt-4 overflow-hidden"
    >
      {/* Anchor for About navigation target */}
      <div id="about" className="absolute top-0 -mt-28" aria-hidden="true" />

      {/* Ambient radial glow — reinforces the 3D scene atmosphere on the right */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 55% 65% at 75% 50%, rgba(0,240,255,0.065) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 72% 50%, rgba(138,43,226,0.045) 0%, transparent 65%)',
        }}
      />

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">

        {/* ─── LEFT COLUMN: Text Content ─── */}
        <div className="flex flex-col z-content lg:pr-6">

          {/* Availability Status Pill */}
          <div
            ref={pillRef}
            className="inline-flex self-start items-center gap-2.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-1.5 text-xs font-mono text-accent-cyan shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
            </span>
            <Zap className="h-3 w-3" />
            <span className="font-semibold tracking-wider uppercase">
              SYSTEM ONLINE &bull; {personalProfile.status.availabilityNotice}
            </span>
          </div>

          {/* Main Headline */}
          <div ref={headlineRef} className="mt-8 flex flex-col gap-2">
            <h1 className="font-display font-extrabold tracking-tight leading-none">
              <span className="block text-text-primary text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl">
                Hi, I&apos;m
              </span>
              <span
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-8xl bg-gradient-to-r from-accent-cyan via-white to-accent-violet bg-clip-text text-transparent"
                style={{ lineHeight: 1.1 }}
              >
                Prince Rana.
              </span>
            </h1>
          </div>

          {/* Designation */}
          <p
            ref={designationRef}
            className="mt-5 font-display text-lg font-medium tracking-tight text-text-secondary sm:text-xl md:text-2xl max-w-xl"
          >
            Software Development Engineer &amp; Artificial Intelligence Specialist.
          </p>

          {/* Bio */}
          <p
            ref={bioRef}
            className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            {personalProfile.shortBio}
          </p>

          {/* CTA Buttons */}
          <div ref={ctasRef} className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticWrapper strength={0.22} maxOffset={10}>
              <Button
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('#projects', { offset: -104 });
                }}
                variant="primary"
                size="lg"
              >
                Explore My Work
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.22} maxOffset={10}>
              <Button
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('#contact', { offset: -104 });
                }}
                variant="secondary"
                size="lg"
              >
                Let&apos;s Connect
                <Mail className="h-4 w-4" />
              </Button>
            </MagneticWrapper>
          </div>

          {/* Social / Profile Links */}
          <div
            ref={socialsRef}
            className="mt-10 flex flex-wrap items-center gap-6 border-t border-border-subtle/60 pt-6"
          >
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

        {/* ─── RIGHT COLUMN: Transparent window into 3D scene with HUD overlay ─── */}
        <div
          ref={hudRef}
          className="hidden lg:flex relative h-[580px] items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          {/* Corner bracket decorations — HUD framing */}
          <span className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-accent-cyan/50" />
          <span className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-accent-cyan/50" />
          <span className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-accent-cyan/50" />
          <span className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-accent-cyan/50" />

          {/* Concentric glow rings — compositing layer over the global 3D scene */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute rounded-full border border-accent-cyan/22 animate-pulse-glow"
              style={{ width: 210, height: 210 }}
            />
            <div
              className="absolute rounded-full border border-accent-violet/15 animate-spin-slow"
              style={{ width: 310, height: 310, borderStyle: 'dashed' }}
            />
            <div
              className="absolute rounded-full border border-accent-cyan/10 animate-spin-reverse-slow"
              style={{ width: 410, height: 410, borderStyle: 'dashed' }}
            />
            <div
              className="absolute rounded-full border border-accent-violet/6 animate-pulse-slow"
              style={{ width: 500, height: 500 }}
            />
            {/* Core crosshair dot */}
            <div className="relative flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-accent-cyan shadow-[0_0_16px_6px_rgba(0,240,255,0.5)] animate-pulse" />
            </div>
          </div>

          {/* HUD data labels */}
          <div
            className="absolute top-14 right-8 flex flex-col items-end gap-0.5 animate-float"
            style={{ animationDelay: '0s' }}
          >
            <span className="font-mono text-[9px] text-accent-cyan/55 uppercase tracking-widest">CF Rating</span>
            <span className="font-mono text-sm font-bold text-accent-cyan">1498</span>
          </div>

          <div
            className="absolute bottom-20 right-8 flex flex-col items-end gap-0.5 animate-float"
            style={{ animationDelay: '1.6s' }}
          >
            <span className="font-mono text-[9px] text-accent-violet/55 uppercase tracking-widest">LeetCode</span>
            <span className="font-mono text-sm font-bold text-accent-violet">400+</span>
          </div>

          <div
            className="absolute top-14 left-8 flex flex-col items-start gap-0.5 animate-float"
            style={{ animationDelay: '0.9s' }}
          >
            <span className="font-mono text-[9px] text-accent-cyan/55 uppercase tracking-widest">CGPA</span>
            <span className="font-mono text-sm font-bold text-accent-cyan">7.96</span>
          </div>

          <div
            className="absolute bottom-20 left-8 flex flex-col items-start gap-0.5 animate-float"
            style={{ animationDelay: '2.2s' }}
          >
            <span className="font-mono text-[9px] text-accent-emerald/55 uppercase tracking-widest">Status</span>
            <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-accent-emerald">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-ping inline-flex" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-text-muted"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">SCROLL</span>
        <div className="h-8 w-4 rounded-full border border-border-subtle p-0.5 flex justify-center">
          <div className="h-2 w-1 rounded-full bg-accent-cyan animate-bounce" />
        </div>
      </div>
    </section>
  );
};
