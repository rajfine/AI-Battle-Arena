import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: '../Server/dist/client',
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
})
