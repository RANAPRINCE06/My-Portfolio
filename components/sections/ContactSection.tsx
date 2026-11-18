'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Linkedin,
  Github,
  Terminal,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  Tag,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MagneticWrapper } from '@/components/ui/MagneticWrapper';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { RoyalPRLogo } from '@/components/ui/RoyalPRLogo';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { personalProfile } from '@/content';
import { contactSchema, type ContactFormData } from '@/lib/validation/contact-schema';
import { cn } from '@/lib/utils';

export const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const email = 'rana.prince1806@gmail.com';
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState<string>('');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. Ambient lighting glow animation
      if (ambientRef.current && !isMobile) {
        gsap.fromTo(
          ambientRef.current,
          { opacity: 0.25, scale: 0.94, y: 16 },
          {
            opacity: 0.85,
            scale: 1.05,
            y: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'bottom 80%',
              scrub: 0.85,
            },
          }
        );
      }

      // 2. Eyebrow & header entrance
      gsap.from('.contact-eyebrow', {
        y: 14,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: section,
          start: 'top 86%',
          once: true,
        },
      });

      // 3. Form and Channels staggered entrance
      gsap.from('.contact-panel-item', {
        y: isMobile ? 18 : 28,
        scale: 0.98,
        opacity: 0,
        duration: isMobile ? 0.45 : 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.contact-grid-container',
          start: 'top 88%',
          once: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  const handleCopyEmail = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleStartConversation = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      nameInputRef.current?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateField = (field: keyof ContactFormData) => {
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === field);
      if (issue) {
        setFieldErrors((prev) => ({ ...prev, [field]: issue.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    // Client-side validation
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        errors[fieldName] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStatus('submitting');
    setServerMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setServerMessage(
          data.devMode
            ? 'Dispatch received (development mode). Thank you for reaching out!'
            : 'Your transmission was securely delivered. I will respond within 12–24 hours.'
        );
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      } else {
        setStatus('error');
        setServerMessage(data.error || 'Failed to dispatch message. Please try direct email.');
      }
    } catch {
      setStatus('error');
      setServerMessage('Network connectivity error. Please reach out directly to rana.prince1806@gmail.com.');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact & Engineering Inquiries"
      className="relative flex scroll-mt-28 flex-col gap-10"
    >
      {/* Subtle depth-parallax atmospheric lighting */}
      <div
        ref={ambientRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(138, 43, 226, 0.08) 0%, rgba(0, 240, 255, 0.05) 45%, transparent 75%)',
        }}
      />

      {/* Section Header */}
      <div>
        <div className="contact-eyebrow flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            SYSTEM DISPATCH &bull; TRANSMISSION TERMINAL
          </span>
        </div>
        <SplitTextReveal
          text="Initiate Engineering Collaboration"
          as="h2"
          className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl"
        />
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Actively seeking Software Development Engineer (SDE) and Artificial Intelligence engineering
          internships, co-op opportunities, and collaborative technical initiatives.
        </p>

        {/* Action CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={handleStartConversation}
            variant="primary"
            size="md"
            className="font-mono text-xs gap-2 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Start a Conversation</span>
          </Button>
          <Button
            href="https://github.com/RANAPRINCE06"
            external
            variant="outline"
            size="md"
            className="font-mono text-xs gap-2"
          >
            <Github className="h-4 w-4" />
            <span>Explore GitHub</span>
          </Button>
        </div>
      </div>

      {/* Contact Grid Container */}
      <div className="contact-grid-container grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Interactive Contact Form (7 cols on lg) */}
        <div className="contact-panel-item lg:col-span-7">
          <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-background-glass/95 p-6 md:p-8 backdrop-blur-2xl shadow-card-glass transition-all duration-300 hover:border-accent-cyan/40">
            {/* Terminal Window Header Bar */}
            <div className="flex items-center justify-between border-b border-border-subtle/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  DISPATCH_TERMINAL.sh
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-accent-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-ping" />
                <span>SECURE SSL</span>
              </div>
            </div>

            {/* Success State */}
            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-text-primary">
                  Transmission Acknowledged
                </h3>
                <p className="mt-2 max-w-md text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {serverMessage}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-background-surface/80 px-4 py-2 font-mono text-xs text-text-primary hover:border-accent-cyan hover:text-accent-cyan transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Another Message</span>
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Honeypot anti-spam field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-honeypot">Leave blank</label>
                  <input
                    type="text"
                    id="contact-honeypot"
                    name="honeypot"
                    tabIndex={-1}
                    value={formData.honeypot}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>

                {/* Error Banner */}
                {status === 'error' && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 font-mono text-xs text-rose-300"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{serverMessage}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-mono text-xs text-text-muted mb-1.5 font-medium"
                    >
                      Your Name <span className="text-accent-cyan">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        ref={nameInputRef}
                        type="text"
                        id="contact-name"
                        name="name"
                        required
                        disabled={status === 'submitting'}
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => validateField('name')}
                        placeholder="e.g. Alex Mercer"
                        className={cn(
                          'w-full rounded-xl border bg-background-surface/60 pl-10 pr-3.5 py-2.5 font-mono text-xs text-text-primary placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50',
                          fieldErrors.name
                            ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
                            : 'border-border-subtle focus:border-accent-cyan'
                        )}
                      />
                    </div>
                    {fieldErrors.name && (
                      <p className="mt-1 font-mono text-[11px] text-rose-400">{fieldErrors.name}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-mono text-xs text-text-muted mb-1.5 font-medium"
                    >
                      Email Address <span className="text-accent-cyan">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        required
                        disabled={status === 'submitting'}
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => validateField('email')}
                        placeholder="alex@enterprise.com"
                        className={cn(
                          'w-full rounded-xl border bg-background-surface/60 pl-10 pr-3.5 py-2.5 font-mono text-xs text-text-primary placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50',
                          fieldErrors.email
                            ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
                            : 'border-border-subtle focus:border-accent-cyan'
                        )}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="mt-1 font-mono text-[11px] text-rose-400">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block font-mono text-xs text-text-muted mb-1.5 font-medium"
                  >
                    Subject <span className="text-accent-cyan">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
                      <Tag className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="contact-subject"
                      name="subject"
                      required
                      disabled={status === 'submitting'}
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={() => validateField('subject')}
                      placeholder="e.g. SDE Internship Opportunity / AI Systems Collaboration"
                      className={cn(
                        'w-full rounded-xl border bg-background-surface/60 pl-10 pr-3.5 py-2.5 font-mono text-xs text-text-primary placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50',
                        fieldErrors.subject
                          ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
                          : 'border-border-subtle focus:border-accent-cyan'
                      )}
                    />
                  </div>
                  {fieldErrors.subject && (
                    <p className="mt-1 font-mono text-[11px] text-rose-400">{fieldErrors.subject}</p>
                  )}
                </div>

                {/* Message Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="contact-message"
                      className="block font-mono text-xs text-text-muted font-medium"
                    >
                      Message Payload <span className="text-accent-cyan">*</span>
                    </label>
                    <span className="font-mono text-[10px] text-text-muted">
                      {formData.message.length} / 3000
                    </span>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-3 left-3.5 text-text-muted">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      disabled={status === 'submitting'}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={() => validateField('message')}
                      placeholder="Outline project requirements, engineering role specifications, or collaboration details..."
                      className={cn(
                        'w-full rounded-xl border bg-background-surface/60 pl-10 pr-3.5 py-2.5 font-mono text-xs text-text-primary placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 resize-y',
                        fieldErrors.message
                          ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
                          : 'border-border-subtle focus:border-accent-cyan'
                      )}
                    />
                  </div>
                  {fieldErrors.message && (
                    <p className="mt-1 font-mono text-[11px] text-rose-400">{fieldErrors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent-cyan" />
                    <span>Rate-limited &bull; Anti-spam protected</span>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-xl bg-accent-cyan px-5 py-2.5 font-mono text-xs font-semibold text-background-primary transition-all duration-200 select-none shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:bg-accent-cyan/90 hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
                      status === 'submitting' && 'opacity-70 cursor-not-allowed'
                    )}
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Direct Channels & Verified Credentials (5 cols on lg) */}
        <div className="contact-panel-item flex flex-col gap-4 lg:col-span-5">
          {/* Direct Email Card with 1-Click Copy */}
          <div className="rounded-2xl border border-border-subtle bg-background-glass/90 p-5 md:p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan/40">
            <div className="flex items-center justify-between border-b border-border-subtle/70 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted block">
                    Direct Email
                  </span>
                  <span className="font-mono text-xs font-semibold text-text-primary">
                    {email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-1 rounded-lg border border-border-subtle bg-background-surface/80 px-2.5 py-1.5 font-mono text-[11px] text-text-muted hover:border-accent-cyan hover:text-accent-cyan transition-colors"
                aria-label="Copy direct email address"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-accent-emerald" />
                    <span className="text-accent-emerald font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[11px] text-text-muted">
                Response Window: 12&ndash;24 Hours
              </span>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1 font-mono text-xs text-accent-cyan hover:underline font-semibold"
              >
                <span>Launch Mail App</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Resume & Credentials Card */}
          <div className="rounded-2xl border border-border-subtle bg-background-glass/90 p-5 backdrop-blur-xl transition-all duration-300 hover:border-accent-violet/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-violet/30 bg-accent-violet/10 text-accent-violet">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-text-primary">
                    Curriculum Vitae / Resume
                  </h4>
                  <p className="font-mono text-[11px] text-text-muted">
                    Synchronized with verified GitHub &amp; CP metrics
                  </p>
                </div>
              </div>
              <a
                href={personalProfile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-xl border border-accent-violet/40 bg-accent-violet/15 px-3 py-1.5 font-mono text-xs text-accent-violet hover:bg-accent-violet/25 transition-colors font-medium"
                aria-label="View verified resume PDF"
              >
                <span>View</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Verified External Profiles Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* GitHub */}
            <a
              href="https://github.com/RANAPRINCE06"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-border-subtle bg-background-glass p-4 backdrop-blur-xl transition-all hover:border-accent-cyan hover:shadow-card-glass"
            >
              <div className="flex items-center justify-between text-text-muted group-hover:text-accent-cyan">
                <Github className="h-4 w-4" />
                <ExternalLink className="h-3 w-3" />
              </div>
              <div className="mt-3">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                  GitHub
                </span>
                <span className="font-mono text-xs font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                  @RANAPRINCE06
                </span>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/prince-rana-0b622b32a"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-border-subtle bg-background-glass p-4 backdrop-blur-xl transition-all hover:border-accent-cyan hover:shadow-card-glass"
            >
              <div className="flex items-center justify-between text-text-muted group-hover:text-accent-cyan">
                <Linkedin className="h-4 w-4" />
                <ExternalLink className="h-3 w-3" />
              </div>
              <div className="mt-3">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                  LinkedIn
                </span>
                <span className="font-mono text-xs font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                  Prince Rana
                </span>
              </div>
            </a>

            {/* LeetCode */}
            <a
              href="https://leetcode.com/u/RANA_PRINCE_06/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-border-subtle bg-background-glass p-4 backdrop-blur-xl transition-all hover:border-emerald-400 hover:shadow-card-glass"
            >
              <div className="flex items-center justify-between text-text-muted group-hover:text-emerald-400">
                <Code2 className="h-4 w-4" />
                <ExternalLink className="h-3 w-3" />
              </div>
              <div className="mt-3">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                  LeetCode
                </span>
                <span className="font-mono text-xs font-semibold text-text-primary group-hover:text-emerald-400 transition-colors">
                  Knight &bull; 400+
                </span>
              </div>
            </a>

            {/* Codeforces */}
            <a
              href="https://codeforces.com/profile/rana_prince.1806"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-border-subtle bg-background-glass p-4 backdrop-blur-xl transition-all hover:border-accent-cyan hover:shadow-card-glass"
            >
              <div className="flex items-center justify-between text-text-muted group-hover:text-accent-cyan">
                <Terminal className="h-4 w-4" />
                <ExternalLink className="h-3 w-3" />
              </div>
              <div className="mt-3">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                  Codeforces
                </span>
                <span className="font-mono text-xs font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                  Specialist &bull; 1565
                </span>
              </div>
            </a>
          </div>

          {/* Availability Status Badge */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 font-mono text-xs text-emerald-400 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>
              {personalProfile.status.availabilityNotice ||
                'Available for Summer / Fall SDE Internships & Collaborative AI Engineering.'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
