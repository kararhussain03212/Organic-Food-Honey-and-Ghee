import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const assetFileNamesConfig = (assetInfo) => {
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
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // PHP backend writes cache/upload files inside the project root on
      // every request; watching them makes the dev server full-reload the
      // site whenever the API is hit. Only src/public/index.html matter.
      ignored: [
        "**/backend/**",
        "**/admin/**",
        "**/dist/**",
        "**/vendor/**",
        "**/database/**",
      ],
    },
    proxy: {
      "/api": {
        target: "https://arionorganicfood.com",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: assetFileNamesConfig,
      },
    },
  },
})
