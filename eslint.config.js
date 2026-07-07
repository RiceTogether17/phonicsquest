/**
 * PhonicsQuest ESLint flat config.
 *
 * Conservative, correctness-focused ruleset: the goal is catching real bugs
 * (unused vars, accidental globals, loose equality), not enforcing style.
 * Tighten incrementally rather than landing a giant reformat.
 */
import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['docs/**', 'node_modules/**', 'play-store/**'],
  },
  {
    files: ['src/**/*.js', 'tests/**/*.js', 'scripts/**/*.mjs', 'vite.config.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', {
        args: 'none',
        varsIgnorePattern: '^_',
        caughtErrors: 'none',
      }],
      eqeqeq: ['error', 'smart'],
      'no-implicit-globals': 'error',
      'no-var': 'error',
      'prefer-const': ['warn', { destructuring: 'all' }],
      // The codebase legitimately uses empty catch for best-effort paths.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    // Service worker runs in a worker scope, not the page.
    files: ['public/sw.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'script',
      globals: { ...globals.serviceworker },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      eqeqeq: ['error', 'smart'],
    },
  },
  {
    // Vitest test files use describe/it/expect via imports, plus mocks that
    // reassign globals.
    files: ['tests/**/*.js', 'src/__tests__/**/*.js'],
    rules: {
      'no-implicit-globals': 'off',
    },
  },
];
