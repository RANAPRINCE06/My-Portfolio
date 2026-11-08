'use client';

import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Linkedin,
  Github,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { personalProfile } from '@/content';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'rana.prince1806@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" aria-label="Contact & Inquiries" className="flex flex-col gap-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-cyan" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            DISPATCH &bull; CONNECT
          </span>
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Initiate Engineering Collaboration
        </h2>
      </div>

      {/* Main Terminal Card */}
      <div className="rounded-2xl border border-border-subtle bg-background-glass/80 p-8 backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan/40 shadow-card-glass">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border-subtle/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-accent-cyan mb-2">
              <Terminal className="h-3.5 w-3.5" />
              <span>DIRECT CHANNELS AVAILABLE</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-text-primary">
              Ready to architect impactful systems together?
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
              Actively seeking Software Development Engineer (SDE) and Artificial Intelligence engineering
              internships, co-op opportunities, and collaborative technical initiatives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              href={`mailto:${email}`}
              variant="primary"
              size="md"
            >
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
            <Button
              href={personalProfile.resumeUrl}
              external
              variant="secondary"
              size="md"
            >
              <FileText className="h-4 w-4" />
              View Resume
            </Button>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Email Channel */}
          <div className="flex items-center justify-between rounded-xl border border-border-subtle/70 bg-background-surface/40 p-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <Mail className="h-5 w-5 text-accent-cyan shrink-0" />
              <div className="overflow-hidden">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                  Email Dispatch
                </span>
                <span className="font-mono text-xs text-text-primary truncate block font-medium">
                  {email}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="ml-2 rounded-lg p-2 text-text-muted transition-colors hover:text-accent-cyan hover:bg-white/[0.04]"
              aria-label="Copy email address"
            >
              {copied ? (
                <Check className="h-4 w-4 text-accent-emerald" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* LinkedIn Channel */}
          <a
            href="https://www.linkedin.com/in/prince-rana-0b622b32a"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-border-subtle/70 bg-background-surface/40 p-4 transition-all hover:border-accent-cyan hover:bg-accent-cyan/5 group"
          >
            <div className="flex items-center gap-3">
              <Linkedin className="h-5 w-5 text-accent-violet group-hover:text-accent-cyan transition-colors" />
              <div>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                  Professional Network
                </span>
                <span className="font-mono text-xs text-text-primary font-medium">
                  LinkedIn Profile
                </span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-text-muted group-hover:text-accent-cyan transition-colors" />
          </a>

          {/* GitHub Channel */}
          <a
            href="https://github.com/RANAPRINCE06"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-border-subtle/70 bg-background-surface/40 p-4 transition-all hover:border-accent-cyan hover:bg-accent-cyan/5 group"
          >
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5 text-text-primary group-hover:text-accent-cyan transition-colors" />
              <div>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                  Source Repositories
                </span>
                <span className="font-mono text-xs text-text-primary font-medium">
                  @RANAPRINCE06
                </span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-text-muted group-hover:text-accent-cyan transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
};

