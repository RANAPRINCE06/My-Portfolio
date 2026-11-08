'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'violet' | 'emerald';
}

export const BentoCard: React.FC<BentoCardProps> = ({
  className,
  children,
  glowColor = 'cyan',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const glowRgb =
    glowColor === 'cyan'
      ? '0, 240, 255'
      : glowColor === 'violet'
      ? '138, 43, 226'
      : '16, 185, 129';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border-subtle bg-background-glass p-6 backdrop-blur-xl transition-all duration-300 hover:border-border-glow hover:shadow-card-glass',
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight */}
      {isHovered && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(${glowRgb}, 0.12), transparent 80%)`,
          }}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-content">{children}</div>
    </div>
  );
};

