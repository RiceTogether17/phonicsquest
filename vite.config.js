import { defineConfig } from 'vite'

export default defineConfig({
  base: '/blending/',
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
          chartjs: ['chart.js'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
