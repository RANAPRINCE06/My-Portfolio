import React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-accent-cyan text-background-primary font-semibold hover:bg-[#33F3FF] shadow-glow-cyan active:scale-[0.98]',
        secondary:
          'bg-background-elevated text-text-primary border border-border-subtle hover:border-border-glow hover:bg-background-surface active:scale-[0.98]',
        outline:
          'border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan/10 hover:border-accent-cyan active:scale-[0.98]',
        ghost:
          'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
      },
      size: {
        sm: 'h-9 px-3.5 text-xs rounded-lg gap-1.5',
        md: 'h-11 px-5 text-sm rounded-xl gap-2',
        lg: 'h-13 px-7 text-base rounded-2xl gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  external?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  href,
  external,
  children,
  ...props
}) => {
  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cn(buttonVariants({ variant, size, className }))}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </button>
  );
};

