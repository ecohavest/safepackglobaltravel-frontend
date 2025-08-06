import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures assets are loaded relative to the root
  optimizeDeps: {
    exclude: ['lucide-react'], // Keep your exclusion for Lucide icons
  },
  build: {
    outDir: 'dist', // Output directory for build
    sourcemap: true, // Generate sourcemaps for debugging
  },
});