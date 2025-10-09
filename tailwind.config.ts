import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          light: '#60a5fa',
          dark: '#1d4ed8'
        },
        surface: {
          DEFAULT: '#0f172a',
          muted: '#1e293b',
          subtle: '#334155'
        }
      }
    }
  },
  plugins: []
};

export default config;
