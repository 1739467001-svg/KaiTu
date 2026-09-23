import { defineConfig } from 'vite';
export default defineConfig({
  base: process.env.KAITU_BASE_PATH || "/",
  server: {proxy: {'/api/camera': 'http://127.0.0.1:8787', '/api': 'http://127.0.0.1:8080'}},
  build: {chunkSizeWarningLimit:2600},
});
