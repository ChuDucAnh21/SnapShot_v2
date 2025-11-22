import antfu from '@antfu/eslint-config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import playwright from 'eslint-plugin-playwright';
import storybook from 'eslint-plugin-storybook';

export default antfu(
  {
    // Frameworks
    react: true,
    nextjs: true,
    typescript: true,

    // Preferences
    lessOpinionated: true,
    isInEditor: false,

    // Code style (keep semicolons)
    stylistic: { semi: true },

    // Let ESLint also format CSS (nice with Tailwind)
    formatters: { css: true },

    // Flat-config ignores (.eslintignore replacement)
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.vercel/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.cache/**',
    ],
  },
  // --- Accessibility Rules ---
  jsxA11y.flatConfigs.recommended,
  // --- E2E Testing Rules ---
  { ...playwright.configs['flat/recommended'], files: ['**/*.e2e.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}'] },
  // --- Storybook Rules ---
  ...storybook.configs['flat/recommended'],
  // --- Custom Rule Overrides ---
  {
    rules: {
      'antfu/no-top-level-await': 'off', // Allow top-level await
      'style/brace-style': ['error', '1tbs'], // Use the default brace style
      'ts/consistent-type-definitions': ['error', 'type'], // Use `type` instead of `interface`
      // Correct rule key for React destructuring preference
      'react/destructuring-assignment': 'off',
      'node/prefer-global/process': 'off', // Allow using `process.env`
      'style/indent': ['error', 2], // Use 2 spaces for indentation
      // Keep alias guard
      'no-restricted-imports': ['error', { paths: [{ name: '../../components/atoms', message: 'Use @atoms/* alias' }] }],
    },
  },
  // Test niceties scoped to tests only
  { files: ['**/*.{test,spec}.{ts,tsx,js,jsx}'], rules: { 'test/padding-around-all': 'error', 'test/prefer-lowercase-title': 'off' } },
);
