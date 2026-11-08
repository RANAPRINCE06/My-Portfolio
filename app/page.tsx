import React from 'react';
import { ArrowUpRight, Code2, Cpu, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BentoCard } from '@/components/ui/BentoCard';

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6">
      {/* Hero Foundation */}
      <section className="flex flex-col items-start gap-6 pt-8 md:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3.5 py-1 text-xs font-mono text-accent-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
          SYSTEM ONLINE &bull; SDE &amp; AI ENGINEER
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl md:text-7xl">
            Prince Rana
          </h1>
          <p className="font-display text-xl font-medium text-text-secondary sm:text-2xl">
            Architecting Scalable Systems &amp; Intelligent Applications.
          </p>
        </div>

        <p className="max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
          Computer Science &amp; Engineering undergrad specializing in Artificial Intelligence at Parul
          University. Deeply focused on algorithmic problem solving, modern full-stack web architectures,
          and intelligent machine learning integration.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button href="#projects" variant="primary" size="lg">
            Explore Architecture
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          <Button
            href="https://github.com/RANAPRINCE06"
            external
            variant="secondary"
            size="lg"
          >
            GitHub Profile
          </Button>
        </div>
      </section>

      {/* Verified Differentiators Bento Matrix */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BentoCard glowColor="cyan" className="flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-muted">COMPETITIVE PROGRAMMING</span>
            <Code2 className="h-5 w-5 text-accent-cyan" />
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-text-primary">
              1461 <span className="text-sm font-normal text-accent-cyan">Specialist</span>
            </div>
            <p className="font-mono text-xs text-text-secondary mt-1">
              Codeforces &bull; CodeChef 3★ (1606) &bull; 400+ LeetCode
            </p>
          </div>
        </BentoCard>

        <BentoCard glowColor="violet" className="flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-muted">SYSTEM SPECIALIZATION</span>
            <Cpu className="h-5 w-5 text-accent-violet" />
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-text-primary">
              Full-Stack &amp; AI
            </div>
            <p className="font-mono text-xs text-text-secondary mt-1">
              React, Next.js, Node.js, C++, Python, PyTorch
            </p>
          </div>
        </BentoCard>

        <BentoCard glowColor="emerald" className="flex flex-col justify-between gap-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-muted">ACADEMIC FOUNDATION</span>
            <Award className="h-5 w-5 text-accent-emerald" />
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-text-primary">
              B.Tech CSE (AI)
            </div>
            <p className="font-mono text-xs text-text-secondary mt-1">
              Parul University &bull; 2024 &ndash; 2028 &bull; CGPA 7.96
            </p>
          </div>
        </BentoCard>
      </section>

      {/* Architecture Foundation Notice */}
      <section className="rounded-2xl border border-border-subtle bg-background-surface/50 p-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-accent-cyan" />
          <h2 className="font-display text-lg font-semibold text-text-primary">
            Phase 1 Foundation Established
          </h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Next.js App Router, strict TypeScript, Tailwind CSS design tokens, centralized animation
          and WebGL infrastructure are initialized with zero fake metrics and complete migration safety.
        </p>
      </section>
    </div>
  );
}

