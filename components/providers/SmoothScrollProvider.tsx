'use client';

import React from 'react';
import { useLenis } from '@/hooks/useLenis';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Initializes and manages the singular Lenis smooth-scroll instance,
 * syncing scroll metrics to the 3D WebGL scene bridge and GSAP.
 */
export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
}) => {
  useLenis();
  return <>{children}</>;
};

