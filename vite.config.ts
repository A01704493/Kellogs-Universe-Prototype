import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kellogs Universe',
        short_name: 'Kellogs',
        description: 'Una aplicación inspirada en Club Penguin para Kellogg\'s',
        theme_color: '#ef0e44',
        background_color: '#FFF9F9',
        icons: [
          {
            src: '/icons/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icons/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icons/maskable-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      strategies: 'generateSW',
      // Asegurarse de que el plugin encuentre el index.html en la raíz
      devOptions: {
        enabled: true
      }
    })
  ]
}); 