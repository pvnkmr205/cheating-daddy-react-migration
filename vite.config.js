import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL: This makes paths relative so Electron can find assets
  build: {
    outDir: 'dist', // We will tell Electron to look for files here
    emptyOutDir: true,
  },
  server: {
    port: 5173, // The port we will connect to
    strictPort: true,
  }
});