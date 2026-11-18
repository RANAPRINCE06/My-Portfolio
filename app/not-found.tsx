import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RoyalPRLogo } from '@/components/ui/RoyalPRLogo';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <RoyalPRLogo size={64} variant="standalone" showGlow className="mb-2" />

      <div className="mt-6 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
        <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
          HTTP 404 &bull; ROUTE NOT FOUND
        </span>
      </div>

      <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
        Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-sm text-text-secondary leading-relaxed">
        The requested system coordinate does not exist. The portfolio operates as a unified single-page
        experience with direct section anchors.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-accent-cyan px-5 py-2.5 font-mono text-xs font-semibold text-background-primary transition-all duration-200 hover:bg-accent-cyan/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Portfolio</span>
        </Link>
      </div>
    </div>
  );
}

