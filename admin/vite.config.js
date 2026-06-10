import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Build admin assets for https://your-domain.com/admin/
  base: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
  plugins: [react(),
  tailwindcss(),
  ],
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_PROXY_TARGET || "http://localhost/Organic%20Food/backend",
        changeOrigin: true,
      },
      "/uploads": {
        target: process.env.VITE_BACKEND_PROXY_TARGET || "http://localhost/Organic%20Food/backend",
        changeOrigin: true,
      },
    },
  },
})
