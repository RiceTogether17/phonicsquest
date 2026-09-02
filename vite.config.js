import { defineConfig } from 'vite';

export default defineConfig({
  base: '/phonicsquest/',
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
          chartjs: ['chart.js'],
          // The decodable-story bank is ~135 kB of data with two importers,
          // Read-to-Giri (storyMode) and the sight-word weave — both loaded
          // lazily. Rollup's default is to hoist a module shared by two
          // dynamic chunks into their common ancestor, which here is the
          // startup chunk, so the bank was downloaded and parsed by every
          // child on first paint whether or not they ever opened a story.
          // Naming it keeps it a chunk of its own, fetched on demand.
          stories: ['./src/data/stories.js'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**', '**/.claude/worktrees/**', 'e2e/**'],
  },
});
