import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Timers-React/',
  plugins: [
    react(),
    tailwindcss()
  ],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.ts'],
    css: false,
  },
})
