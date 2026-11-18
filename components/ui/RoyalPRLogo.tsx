'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface RoyalPRLogoProps {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'navbar' | 'monogram' | 'footer' | 'standalone' | 'badge';
  showGlow?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

export const RoyalPRLogo: React.FC<RoyalPRLogoProps> = ({
  size = 'md',
  variant = 'monogram',
  showGlow = true,
  className,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 36;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 select-none group',
        className
      )}
      style={{ width: pixelSize, height: pixelSize }}
      aria-label="Prince Rana Royal PR Monogram"
    >
      {/* Ambient Cybernetic / Royal Aura Glow */}
      {showGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-40 blur-md transition-opacity duration-300 group-hover:opacity-80"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.45) 0%, rgba(138, 43, 226, 0.25) 55%, transparent 75%)',
          }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-105"
      >
        <defs>
          {/* Platinum / Metallic Silver Gradient */}
          <linearGradient id="pr-platinum-grad" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#E2E8F0" />
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Electric Cyan Neon Accent */}
          <linearGradient id="pr-cyan-accent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="60%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>

          {/* Royal Violet Shading */}
          <linearGradient id="pr-violet-glow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.4" />
          </linearGradient>

          {/* Outer Border Hairline Gradient */}
          <linearGradient id="pr-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0.6" />
          </linearGradient>

          {/* Subtle Drop Shadow for Letterforms */}
          <filter id="pr-subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. Outer Royal Shield / Precision Squircle Frame */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          fill="#05070D"
          stroke="url(#pr-border-grad)"
          strokeWidth="2"
        />

        {/* Subtle Inner High-Tech Grid Line Accents */}
        <path
          d="M 12 50 H 18 M 82 50 H 88 M 50 88 V 92"
          stroke="#00F0FF"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 2. Geometric Royal Coronet / Crown Apex (Subtle & Architectural) */}
        <g id="royal-coronet">
          {/* Central Imperial Diamond Crest */}
          <polygon
            points="50,11 53.5,15.5 50,20 46.5,15.5"
            fill="url(#pr-cyan-accent)"
            filter="url(#pr-subtle-shadow)"
          />

          {/* Left and Right Coronet Accents */}
          <circle cx="36" cy="18.5" r="1.75" fill="#00F0FF" />
          <circle cx="64" cy="18.5" r="1.75" fill="#38BDF8" />

          {/* Minimalist Coronet Peak Geometry */}
          <path
            d="M 33 24.5 L 36 19.5 L 43 23 L 50 16 L 57 23 L 64 19.5 L 67 24.5 Z"
            fill="url(#pr-platinum-grad)"
            opacity="0.95"
          />
        </g>

        {/* 3. The Interconnected PR Monogram Core */}
        <g id="pr-monogram-body" filter="url(#pr-subtle-shadow)">
          {/* --- Letter 'P' (Left Pillar & Bowl) --- */}
          {/* P Vertical Stem */}
          <path
            d="M 25 28 H 32.5 V 72 H 25 Z"
            fill="url(#pr-platinum-grad)"
          />
          {/* P Top Serif Terminal */}
          <path
            d="M 23 28 H 34.5 V 30.5 H 23 Z"
            fill="url(#pr-cyan-accent)"
          />
          {/* P Bottom Foot Serif */}
          <path
            d="M 23 69.5 H 34.5 V 72 H 23 Z"
            fill="url(#pr-platinum-grad)"
          />

          {/* P Upper Bowl Outer */}
          <path
            d="M 32.5 28 H 47 C 54.5 28 59.5 33 59.5 40 C 59.5 47 54.5 52 47 52 H 32.5 V 28 Z"
            fill="url(#pr-platinum-grad)"
          />
          {/* P Upper Bowl Counter (Cutout) */}
          <path
            d="M 32.5 34.5 H 45.5 C 49.5 34.5 52.5 36.8 52.5 40 C 52.5 43.2 49.5 45.5 45.5 45.5 H 32.5 V 34.5 Z"
            fill="#05070D"
          />

          {/* --- Letter 'R' (Right Interlocking Spine, Bowl & Athletic Leg) --- */}
          {/* R Vertical Stem (Interlocking with P's Bowl) */}
          <path
            d="M 47 28 H 54.5 V 72 H 47 Z"
            fill="url(#pr-platinum-grad)"
          />
          {/* R Top Serif */}
          <path
            d="M 45 28 H 56.5 V 30.5 H 45 Z"
            fill="url(#pr-cyan-accent)"
          />

          {/* R Upper Bowl Outer */}
          <path
            d="M 54.5 28 H 68.5 C 75 28 79.5 32.8 79.5 39.5 C 79.5 46.2 75 51 68.5 51 H 54.5 V 28 Z"
            fill="url(#pr-platinum-grad)"
          />
          {/* R Upper Bowl Counter (Cutout) */}
          <path
            d="M 54.5 34.5 H 67 C 70.5 34.5 72.8 36.6 72.8 39.5 C 72.8 42.4 70.5 44.5 67 44.5 H 54.5 V 34.5 Z"
            fill="#05070D"
          />

          {/* R Dynamic Diagonal Leg (Sweeping Athletic Leg with Platinum & Cyan Edge) */}
          <path
            d="M 57 49 H 65 L 75.5 69.5 H 80 V 72 H 71.5 L 61.5 52.5 H 57 V 49 Z"
            fill="url(#pr-platinum-grad)"
          />

          {/* Dynamic Cyan Energy Inlay on R's Stride */}
          <path
            d="M 64.5 51.5 L 74 70 H 77 L 67.5 51.5 Z"
            fill="url(#pr-cyan-accent)"
            opacity="0.85"
          />

          {/* Interlocking Cyan Accent Bridge between P and R */}
          <path
            d="M 32.5 40 H 47 V 42.5 H 32.5 Z"
            fill="url(#pr-cyan-accent)"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
};
