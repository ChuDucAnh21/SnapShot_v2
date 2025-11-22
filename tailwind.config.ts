/**
 * Minimal Tailwind config for ESLint plugin compatibility
 * Tailwind CSS v4 uses CSS-based configuration (@theme in CSS files)
 * This file exists only to satisfy eslint-plugin-tailwindcss
 */
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './tests/**/*.{js,ts,jsx,tsx}',
  ],
  // Empty theme - actual configuration is in src/styles/global.css and theme.css
  theme: {},
  plugins: [],
};

export default config;
