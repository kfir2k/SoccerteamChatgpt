import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set the base URL for GitHub Pages
  base: '/SoccerteamChatgpt/', // Replace with your actual repo name
  // Build configuration for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps for debugging
    sourcemap: false,
    // Optimize for production
    minify: 'terser',
  },
})