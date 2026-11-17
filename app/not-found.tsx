import React from 'react';
import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan shadow-[0_0_30px_rgba(0,240,255,0.2)]">
        <Terminal className="h-8 w-8" />
      </div>

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
