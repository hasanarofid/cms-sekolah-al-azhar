import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Base path untuk production di root domain
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
