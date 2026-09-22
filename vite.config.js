import { defineConfig } from 'vite';
export default defineConfig({
  server: {proxy: {'/api/camera': 'http://127.0.0.1:8787', '/api': 'http://127.0.0.1:8080'}},
  build: {chunkSizeWarningLimit:2600},
});
