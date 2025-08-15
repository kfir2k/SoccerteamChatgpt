// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/SoccerteamChatgpt/', // keep or set '/' if repo is USERNAME.github.io
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    // tip: default 'esbuild' is faster; 'terser' is okay if you need it
    // minify: 'terser',
  },
})
