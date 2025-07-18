// frontend/vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    },
    hmr: {
      port: 5173
    }
  }
})