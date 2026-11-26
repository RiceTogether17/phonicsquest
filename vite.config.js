import { defineConfig } from 'vite';
import { basePath } from './scripts/base-path.mjs';

export default defineConfig({
  // '/phonicsquest/' for GitHub Pages; set BASE_PATH to host anywhere else.
  base: basePath(),
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
          // The extra grammar MCQ rows would push the grammar bank's chunk
          // past the lazy-chunk budget, so they get a chunk of their own.
          // It is only fetched alongside the grammar bank.
          grammarMcqExtra: [
            './src/data/grammarMcqExtra/index.js',
            './src/data/grammarMcqExtra/early.js',
            './src/data/grammarMcqExtra/middle.js',
            './src/data/grammarMcqExtra/upper.js',
          ],
          // Same for the extra vocabulary MCQ rows.
          vocabMcqExtra: [
            './src/data/vocabMcqExtra/index.js',
            './src/data/vocabMcqExtra/lower.js',
            './src/data/vocabMcqExtra/upperWords.js',
            './src/data/vocabMcqExtra/upperTopics.js',
          ],
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
