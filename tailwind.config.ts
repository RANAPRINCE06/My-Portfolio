import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#05070D',
          secondary: '#0A0D16',
          surface: '#111827',
          elevated: 'rgba(22, 30, 49, 0.8)',
          glass: 'rgba(13, 18, 29, 0.7)',
        },
        accent: {
          cyan: '#00F0FF',
          'cyan-dim': 'rgba(0, 240, 255, 0.15)',
          violet: '#8A2BE2',
          'violet-dim': 'rgba(138, 43, 226, 0.15)',
          emerald: '#10B981',
          amber: '#F59E0B',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(0, 240, 255, 0.3)',
          elevated: 'rgba(255, 255, 255, 0.15)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#475569',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.3)',
        'glow-violet': '0 0 25px -5px rgba(138, 43, 226, 0.3)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      zIndex: {
        canvas: '-1',
        content: '1',
        dock: '40',
        modal: '50',
        toast: '60',
      },
    },
  },
  plugins: [],
};

export default config;
