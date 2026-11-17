'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, Shield, Network, Cpu, Radio, MapPin, Database, Terminal } from 'lucide-react';

interface ProjectVisualProps {
  type?: string;
  projectName: string;
  className?: string;
  isModalHeader?: boolean;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({
  type = 'agent-pipeline',
  projectName,
  className,
  isModalHeader = false,
}) => {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-border-subtle/80 bg-background-surface/80 p-4 select-none',
        isModalHeader ? 'h-48 md:h-56' : 'h-36 md:h-40',
        className
      )}
      aria-label={`Architectural visualization schematic for ${projectName}`}
    >
      {/* Background Matrix Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 240, 255, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 240, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Cyberpunk Vignette & Radial Atmospheric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0, 240, 255, 0.08) 0%, rgba(138, 43, 226, 0.05) 50%, transparent 80%)',
        }}
      />

      {/* Top Header Tag: Strict architectural transparency */}
      <div className="relative z-10 flex items-center justify-between border-b border-border-subtle/60 pb-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent-cyan">
          <Terminal className="h-3 w-3" />
          <span>SCHEMATIC &bull; {type.toUpperCase().replace('-', '_')}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>ACTIVE SPEC</span>
        </div>
      </div>

      {/* Diagram Content Based on Architectural Type */}
      <div className="relative z-10 flex h-[calc(100%-24px)] items-center justify-center">
        {type === 'agent-pipeline' && (
          <div className="flex w-full max-w-md items-center justify-between px-2 text-xs">
            {/* Ingest Node */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan shadow-sm">
                <Network className="h-4 w-4" />
              </div>
              <span className="font-mono text-[10px] text-text-secondary">Webhook Ingest</span>
            </div>

            {/* Connecting Flow Line */}
            <div className="h-0.5 flex-1 bg-gradient-to-r from-accent-cyan/40 to-accent-violet/60 mx-1.5 relative">
              <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-accent-cyan bg-background-primary" />
            </div>

            {/* Agentic Triage Node */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-violet/50 bg-accent-violet/15 text-accent-violet shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <span className="font-mono text-[10px] text-accent-cyan font-semibold">Gemini Agents</span>
            </div>

            {/* Connecting Flow Line */}
            <div className="h-0.5 flex-1 bg-gradient-to-r from-accent-violet/60 to-emerald-400/50 mx-1.5 relative">
              <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-accent-violet bg-background-primary" />
            </div>

            {/* Safety Gate Node */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/40 bg-emerald-400/10 text-emerald-400 shadow-sm">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-mono text-[10px] text-emerald-400">Human Gate</span>
            </div>

            {/* Connecting Flow Line */}
            <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-400/50 to-accent-cyan/40 mx-1.5 relative" />

            {/* Persistence & Dispatch Node */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-cyan/40 bg-background-surface text-text-primary shadow-sm">
                <Database className="h-4 w-4" />
              </div>
              <span className="font-mono text-[10px] text-text-secondary">Redis / Postgres</span>
            </div>
          </div>
        )}

        {type === 'hazard-detection' && (
          <div className="relative flex w-full max-w-sm items-center justify-between px-4">
            {/* Target Reticle with Telemetry Box */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-accent-cyan/60 animate-spin-slow">
                <div className="h-2 w-2 rounded-full bg-accent-cyan animate-ping" />
                <MapPin className="h-5 w-5 text-accent-cyan" />
              </div>
              <div className="flex flex-col gap-0.5 font-mono text-[11px]">
                <span className="text-accent-cyan font-semibold">[SURFACE_DEFECT_DETECTED]</span>
                <span className="text-text-muted">GPS: 12.9716° N, 80.0435° E</span>
                <span className="text-emerald-400 text-[10px]">CONFIDENCE: 94.2%</span>
              </div>
            </div>

            {/* Live Socket.IO Status Badge */}
            <div className="hidden sm:flex flex-col items-end gap-1 font-mono text-[10px] text-text-muted">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-2 py-0.5 text-accent-cyan">
                <Radio className="h-3 w-3 animate-pulse" />
                <span>Socket.IO Live</span>
              </div>
              <span>PORT: 5000 / STREAM</span>
            </div>
          </div>
        )}

        {type === 'venue-grid' && (
          <div className="flex w-full max-w-md items-center justify-center gap-3 px-2">
            {/* Seating Tier Vectors */}
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-3.5 w-4 rounded-sm border transition-colors',
                    i % 5 === 0
                      ? 'border-accent-cyan bg-accent-cyan/30'
                      : i % 3 === 0
                      ? 'border-accent-violet bg-accent-violet/20'
                      : 'border-border-subtle bg-background-surface/80'
                  )}
                />
              ))}
            </div>

            <div className="flex flex-col gap-1 border-l border-border-subtle/80 pl-3 font-mono text-[10px]">
              <span className="text-accent-cyan font-semibold">ARENA_SEATING_MATRIX</span>
              <span className="text-text-secondary">TIER: VIP / CATEGORY 1</span>
              <span className="text-text-muted">STATE: Optimistic Hold</span>
            </div>
          </div>
        )}

        {type === 'nlp-embeddings' && (
          <div className="flex w-full max-w-md items-center justify-around px-2 font-mono text-[10px]">
            <div className="flex flex-col items-center gap-1 rounded-lg border border-accent-cyan/30 bg-background-glass px-2.5 py-1.5 text-center">
              <span className="text-accent-cyan font-semibold">Sentence-BERT</span>
              <span className="text-text-muted">all-MiniLM-L6-v2</span>
              <span className="text-text-secondary">384-Dim Vector</span>
            </div>

            <div className="flex flex-col items-center text-text-muted text-[11px]">
              <span>COSINE SIMILARITY</span>
              <span className="text-accent-cyan font-bold text-xs mt-0.5">0.892 HIGH</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-lg border border-accent-violet/30 bg-background-glass px-2.5 py-1.5 text-center">
              <span className="text-accent-violet font-semibold">spaCy NER</span>
              <span className="text-text-muted">en_core_web_sm</span>
              <span className="text-text-secondary">Skill Extraction</span>
            </div>
          </div>
        )}

        {type === 'crisis-command' && (
          <div className="flex w-full max-w-sm items-center justify-between px-3 font-mono text-[10px]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-red-400">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-text-primary">CRISIS DISPATCH CENTER</span>
                <span className="text-text-muted">Google Maps Geospatial Radar</span>
              </div>
            </div>
            <div className="rounded border border-border-subtle bg-background-surface/80 px-2 py-1 text-emerald-400">
              DISPATCH READY
            </div>
          </div>
        )}

        {type === 'logistics-dag' && (
          <div className="flex w-full max-w-md items-center justify-between px-2 font-mono text-[10px]">
            <div className="rounded border border-border-subtle bg-background-surface px-2 py-1 text-text-secondary">
              Admin / Dispatch
            </div>
            <div className="h-0.5 flex-1 bg-border-subtle mx-1.5 relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] text-accent-cyan font-semibold">
                JWT Auth
              </span>
            </div>
            <div className="rounded border border-accent-cyan/40 bg-accent-cyan/10 px-2 py-1 text-accent-cyan">
              15+ REST APIs
            </div>
            <div className="h-0.5 flex-1 bg-border-subtle mx-1.5" />
            <div className="rounded border border-border-subtle bg-background-surface px-2 py-1 text-text-muted">
              SQLite3 ACID
            </div>
          </div>
        )}

        {type === 'microservices-mesh' && (
          <div className="flex w-full max-w-md items-center justify-around px-2 font-mono text-[10px]">
            <div className="rounded border border-accent-cyan/40 bg-accent-cyan/10 px-2.5 py-1 text-accent-cyan">
              API Gateway
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] text-accent-violet">Apache Kafka Bus</span>
              <div className="h-0.5 w-16 bg-gradient-to-r from-accent-cyan to-accent-violet" />
            </div>
            <div className="flex flex-col gap-1 text-[9px]">
              <span className="rounded border border-border-subtle bg-background-surface px-1.5 py-0.5 text-text-secondary">
                Order Service
              </span>
              <span className="rounded border border-border-subtle bg-background-surface px-1.5 py-0.5 text-text-secondary">
                Inventory Service
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Technical Watermark */}
      <div className="absolute bottom-1 right-2.5 font-mono text-[9px] text-text-muted/60 select-none">
        FIG. {type.toUpperCase()} &bull; SYSTEM SCHEMATIC
      </div>
    </div>
  );
};
