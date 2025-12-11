import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This setting forces the Vite server to listen on all IPs, 
    // making it accessible from the Docker host.
    host: '0.0.0.0', 
    port: 5173, // Optional, but good practice
    watch: {
        usePolling: true // Optional: Helps resolve issues on Linux/WSL sometimes
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  }
})
