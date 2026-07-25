import { defineConfig } from '@playwright/test';

/**
 * End-to-end smoke tests (IMPROVEMENTS.md #28/#29).
 *
 * Runs against the committed production build in docs/ via `vite preview`,
 * so the flows exercise exactly what GitHub Pages ships — including the
 * lazy-chunk loading that unit tests can't see.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173/phonicsquest/',
    trace: 'on-first-retry',
    // Some environments pre-install Chromium outside Playwright's registry;
    // point at it via env instead of downloading a pinned browser build.
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/phonicsquest/',
    reuseExistingServer: !process.env.CI,
  },
});
