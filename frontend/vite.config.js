import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // ← разрешает доступ извне (по IP)
    port: 5173    // ← можно оставить по умолчанию
  }
})
