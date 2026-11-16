import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Прокси для локальной разработки: запросы на /api.php идут на PHP-сервер
    proxy: {
      '/api.php': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})