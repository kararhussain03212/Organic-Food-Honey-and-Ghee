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
  build: {
    rollupOptions: {
      output: {
        // Put all assets in their respective folders
        assetFileNames: (assetInfo) => {
          if (!assetInfo || !assetInfo.name) {
            return 'assets/[name]-[hash][extname]';
          }

          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1]?.toLowerCase();

          if (!ext) {
            return 'assets/[name]-[hash][extname]';
          }

          // Images folder
          if (/png|jpg|jpeg|gif|svg|webp|mp4|webm|mov|avi/.test(ext)) {
            return 'images/[name]-[hash][extname]';
          }

          // Fonts folder
          if (/woff|woff2|ttf|otf|eot/.test(ext)) {
            return 'fonts/[name]-[hash][extname]';
          }

          // CSS stays in assets
          if (ext === 'css') {
            return 'assets/[name]-[hash][extname]';
          }

          // Default
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
})
