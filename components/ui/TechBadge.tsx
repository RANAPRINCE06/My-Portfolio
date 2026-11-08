import React from 'react';
import { cn } from '@/lib/utils';

interface TechBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'violet' | 'emerald' | 'muted';
  size?: 'sm' | 'md';
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  className,
  variant = 'cyan',
  size = 'sm',
  children,
  ...props
}) => {
  const variantStyles = {
    cyan: 'border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan',
    violet: 'border-accent-violet/30 bg-accent-violet/10 text-accent-violet',
    emerald: 'border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald',
    muted: 'border-white/10 bg-white/[0.04] text-text-secondary',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-md font-mono',
    md: 'text-xs px-3 py-1 rounded-lg font-mono',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border font-medium transition-colors select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

