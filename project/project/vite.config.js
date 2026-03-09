import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for Electron compatibility

  // Vitest configuration
  // See: https://vitest.dev/config/
  test: {
    // Node environment — no DOM needed for pure utility functions
    environment: 'node',

    // Discover all test files under src/
    include: ['src/**/*.test.{js,jsx}'],

    // Coverage (run with: npm run test:coverage)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/utils/**', 'src/constants/**'],
      exclude: ['src/**/*.test.{js,jsx}'],
    },
  },
})