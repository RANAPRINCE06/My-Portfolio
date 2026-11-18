'use client';

import React from 'react';
import Image from 'next/image';
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
  const isBadge = variant === 'badge';
  const imageSrc = isBadge ? '/images/royal-pr-badge.png' : '/images/royal-pr-monogram.png';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 select-none group',
        className
      )}
      style={{ width: pixelSize, height: pixelSize }}
      aria-label="Prince Rana Royal PR Monogram"
      data-testid="royal-pr-logo"
    >
      {/* Ambient Cybernetic / Royal Aura Glow */}
      {showGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-50 blur-md transition-opacity duration-300 group-hover:opacity-90"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.45) 0%, rgba(138, 43, 226, 0.25) 55%, transparent 75%)',
          }}
        />
      )}

      {/* Royal PR Monogram Image Asset */}
      <Image
        src={imageSrc}
        alt="Prince Rana Royal PR Monogram"
        width={pixelSize * 2}
        height={pixelSize * 2}
        priority={variant === 'navbar'}
        className={cn(
          'h-full w-full object-contain rounded-full transition-transform duration-300 ease-out group-hover:scale-105 drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]'
        )}
      />
    </div>
  );
};
