'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-dock flex justify-center p-4 md:p-6">
      <nav
        aria-label="Main Navigation"
        className="flex w-full max-w-6xl items-center justify-between rounded-2xl border border-border-subtle bg-background-glass/85 px-5 py-3 shadow-card-glass backdrop-blur-xl transition-all duration-300 hover:border-border-elevated"
      >
        {/* Brand / Monogram */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded-lg px-1.5 py-1"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan transition-transform group-hover:scale-105">
            <Terminal className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-tight">PRINCE RANA</span>
            <span className="font-mono text-[10px] tracking-wider text-accent-cyan uppercase">
              SDE &bull; AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Callout */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            href="https://github.com/RANAPRINCE06"
            external
            variant="outline"
            size="sm"
            className="font-mono text-xs"
          >
            GitHub
          </Button>
          <Button href="#contact" variant="primary" size="sm" className="font-mono text-xs">
            Connect
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-white/[0.03] text-text-secondary transition-colors hover:text-text-primary md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-4 top-20 z-modal flex flex-col gap-2 rounded-2xl border border-border-elevated bg-background-secondary/95 p-5 shadow-2xl backdrop-blur-2xl md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-border-subtle">
            <Button
              href="https://github.com/RANAPRINCE06"
              external
              variant="outline"
              size="md"
              className="w-full font-mono text-xs"
            >
              GitHub Profile
            </Button>
            <Button
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              variant="primary"
              size="md"
              className="w-full font-mono text-xs"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

