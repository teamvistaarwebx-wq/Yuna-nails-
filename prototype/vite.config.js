import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  server: { port: 5173, strictPort: false, host: true },
  build: {
    rollupOptions: {
      input: { index: resolve(__dirname, 'index.html'), screen: resolve(__dirname, 'screen.html') },
    },
  },
});
