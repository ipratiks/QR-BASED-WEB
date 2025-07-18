import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'qrcode.react', 'html5-qrcode'],
  },
  server: {
    host: true, // This allows access from network devices (optional)
    port: 5173, // Ensure this matches your desired port
  }
});