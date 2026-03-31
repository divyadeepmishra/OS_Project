import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['var(--font-headline)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#a0373b',
          light: '#ff7f7f',
          container: '#ffc3c2',
        },
        surface: {
          DEFAULT: '#f7f4f4',
          low: '#f1eded',
          lowest: '#ffffff',
          high: '#e8e4e4',
          highest: '#dddada',
          dark: '#7a1e24',
        },
        'on-surface': {
          DEFAULT: '#2e2424',
          muted: '#6b5a5a',
          faint: '#9e8888',
        },
        success: '#1a6b3a',
        warning: '#7d5700',
        error: '#ba1a1a',
        info: '#1a4d7a',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(160,55,59,0.08), 0 1px 4px 0 rgba(46,36,36,0.05)',
        float:
          '0 8px 40px 0 rgba(160,55,59,0.12), 0 2px 8px 0 rgba(46,36,36,0.06)',
        modal:
          '0 24px 64px 0 rgba(160,55,59,0.16), 0 4px 16px 0 rgba(46,36,36,0.08)',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'slide-right': 'slide-in-right 0.3s ease',
        'fade-up': 'fade-up 0.4s ease',
        shimmer: 'shimmer 3s linear infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.4' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-up': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
