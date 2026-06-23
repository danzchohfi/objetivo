import { defineConfig } from 'vite';

export default defineConfig({
  // '/' for local/Vercel; '/objetivo/' when building for GitHub Pages (set via env)
  base: process.env.BASE_PATH || '/',
  server: { host: true, port: 5173 },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 4096,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
