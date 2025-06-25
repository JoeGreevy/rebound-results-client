import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // root: '.',
  // plugins: [react({
  //     jsxRuntime: 'automatic', // Explicitly use the automatic JSX runtime
  //   })],
  plugins: [react()],
  server: {
    proxy: {
      '/api' : 'https://rebound-results-api.onrender.com',
    }
  }
})


