import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-content border-t border-border-subtle bg-background-secondary/40 py-12 px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <p className="font-display text-sm font-semibold text-text-primary">
            Prince Rana &mdash; Software Engineer &amp; AI
          </p>
          <p className="font-mono text-xs text-text-muted mt-1">
            Engineered with Next.js, TypeScript &amp; Tailwind CSS
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-text-secondary">
          <a
            href="https://github.com/RANAPRINCE06"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent-cyan"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/prince-rana-0b622b32a"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent-cyan"
          >
            LinkedIn
          </a>
          <a
            href="https://codeforces.com/profile/rana_prince.1806"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent-cyan"
          >
            Codeforces
          </a>
          <a
            href="https://leetcode.com/u/RANA_PRINCE_06/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent-cyan"
          >
            LeetCode
          </a>
        </div>

        <p className="font-mono text-xs text-text-muted">
          &copy; {currentYear} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

