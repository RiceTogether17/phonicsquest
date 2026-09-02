/**
 * PhonicsQuest ESLint flat config.
 *
 * Conservative, correctness-focused ruleset: the goal is catching real bugs
 * (unused vars, accidental globals, loose equality), not enforcing style.
 * Tighten incrementally rather than landing a giant reformat.
 */
import js from '@eslint/js';
import globals from 'globals';

/**
 * XSS guard. Assigning an interpolated template literal straight to
 * innerHTML is how a profile-name injection reached the weekly recap:
 * every such site relies on the author remembering to escape.
 *
 * Prefer the auto-escaping html`` tag in src/utils/html.js — it returns a
 * Raw wrapper rather than a bare TemplateLiteral, so migrated code passes
 * this rule automatically.
 *
 * Rollout: `warn` codebase-wide (a backlog of pre-existing hand-escaped
 * sites), `error` on files that have finished migrating. `npm run lint`
 * pins `--max-warnings` to the current backlog size, so the count can only
 * go down — lower it as files migrate.
 */
const INNER_HTML_RULE = {
  selector:
    'AssignmentExpression[left.property.name="innerHTML"] > TemplateLiteral[expressions.length>0]',
  message:
    'Do not assign an interpolated template literal to innerHTML — use the auto-escaping html`` tag from src/utils/html.js (or escapeHtml() on every interpolation).',
};

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
      'no-unused-vars': [
        'error',
        {
          args: 'none',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
      eqeqeq: ['error', 'smart'],
      'no-implicit-globals': 'error',
      'no-var': 'error',
      'prefer-const': ['warn', { destructuring: 'all' }],
      // The codebase legitimately uses empty catch for best-effort paths.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    // XSS guard. Assigning an interpolated template literal straight to
    // innerHTML is how the profile-name injection got in: every such site
    // relies on the author remembering to escape. Use the auto-escaping
    // html`` tag from src/utils/html.js instead (it returns a Raw, so it is
    // not a bare TemplateLiteral and passes this rule).
    //
    // Existing hand-escaped call sites are grandfathered with targeted
    // disables; new code must use html``.
    // Warn across the codebase: ~166 pre-existing sites are hand-escaped and
    // migrate opportunistically. This keeps the backlog visible without
    // failing CI on code that predates the rule.
    files: ['src/**/*.js'],
    ignores: ['src/__tests__/**'],
    rules: {
      'no-restricted-syntax': ['warn', INNER_HTML_RULE],
    },
  },
  {
    // Error on surfaces that are fully migrated to html`` — these render
    // user-supplied or AI-produced text and must not regress. Add files here
    // as they finish migrating.
    files: ['src/components/weeklyRecap.js'],
    rules: {
      'no-restricted-syntax': ['error', INNER_HTML_RULE],
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
