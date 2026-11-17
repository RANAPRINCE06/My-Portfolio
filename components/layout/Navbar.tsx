'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MagneticWrapper } from '@/components/ui/MagneticWrapper';
import { scrollToTarget } from '@/lib/scroll-bridge';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#about', label: 'About', sectionId: 'hero' },
  { href: '#statistics', label: 'Telemetry', sectionId: 'statistics' },
  { href: '#projects', label: 'Projects', sectionId: 'projects' },
  { href: '#skills', label: 'Skills', sectionId: 'skills' },
  { href: '#experience', label: 'Experience', sectionId: 'experience' },
  { href: '#simulations', label: 'Simulations', sectionId: 'simulations' },
  { href: '#achievements', label: 'Achievements', sectionId: 'achievements' },
  { href: '#certifications', label: 'Certifications', sectionId: 'certifications' },
  { href: '#contact', label: 'Contact', sectionId: 'contact' },
];

const NAV_SECTION_IDS = NAV_LINKS.map((item) => item.sectionId);

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useActiveSection(NAV_SECTION_IDS, 'hero');
  const [isScrolled, setIsScrolled] = useState(false);

  const activeHref = NAV_LINKS.find((item) => item.sectionId === activeSectionId)?.href ?? '#about';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    closeMobile = false
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const matched = NAV_LINKS.find((l) => l.href === href);
      if (matched) setActiveSectionId(matched.sectionId);
      if (closeMobile) setMobileMenuOpen(false);
      scrollToTarget(href, { offset: href === '#about' ? 0 : -104 });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-dock flex justify-center p-3 sm:p-4 md:p-6">
      <nav
        aria-label="Main Navigation"
        className={cn(
          'flex w-full max-w-6xl items-center justify-between rounded-2xl border px-4 sm:px-5 py-2.5 sm:py-3 shadow-card-glass backdrop-blur-xl transition-all duration-300',
          isScrolled
            ? 'border-border-elevated bg-background-secondary/90'
            : 'border-border-subtle bg-background-glass/85 hover:border-border-elevated'
        )}
      >
        {/* Brand / Monogram */}
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              setActiveSectionId('hero');
              scrollToTarget(0);
            }
          }}
          className="group flex items-center gap-2.5 text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded-lg px-1.5 py-1"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan transition-transform group-hover:scale-105">
            <Terminal className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xs sm:text-sm font-bold tracking-tight">PRINCE RANA</span>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-accent-cyan uppercase">
              SDE &bull; AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-0.5 xl:gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative rounded-lg px-2 xl:px-2.5 py-1.5 text-[11px] xl:text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
                  isActive
                    ? 'bg-accent-cyan/10 text-accent-cyan font-semibold'
                    : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute bottom-0.5 left-2 right-2 h-[1.5px] rounded-full bg-accent-cyan transition-all duration-300',
                    isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                  )}
                />
              </Link>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="hidden lg:flex items-center gap-2.5">
          <Button
            href="https://github.com/RANAPRINCE06"
            external
            variant="outline"
            size="sm"
            className="font-mono text-[11px] px-2.5 py-1"
          >
            GitHub
          </Button>
          <MagneticWrapper strength={0.2} maxOffset={8}>
            <Button
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget('#contact', { offset: -104 });
              }}
              variant="primary"
              size="sm"
              className="font-mono text-[11px] px-3 py-1"
            >
              Connect
            </Button>
          </MagneticWrapper>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-white/[0.03] text-text-secondary transition-colors hover:text-text-primary lg:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-4 top-20 z-modal flex flex-col gap-1.5 rounded-2xl border border-border-elevated bg-background-secondary/95 p-5 shadow-2xl backdrop-blur-2xl lg:hidden max-h-[80vh] overflow-y-auto"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, true)}
                className={cn(
                  'rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent-cyan/10 text-accent-cyan font-semibold'
                    : 'text-text-secondary hover:bg-white/[0.05] hover:text-text-primary'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-2 flex flex-col gap-2 pt-3 border-t border-border-subtle">
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
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollToTarget('#contact', { offset: -96 });
              }}
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
