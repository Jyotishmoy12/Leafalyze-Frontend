import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'robots.txt', 'logo.png'],
      manifest: {
        name: 'Leafalyze',
        short_name: 'Leafalyze',
        description: 'A Progressive Web App for Raspberry Pi',
        theme_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: '/logo.png?v=2', // Cache-busting query parameter
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/logo.png?v=2', // Cache-busting query parameter
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/leafalyze\.vercel\.app\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'leafalyze-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Cache for 30 days
              },
              cacheableResponse: {
                statuses: [0, 200] // Cache successful responses
              }
            }
          }
        ],
        navigateFallback: '/index.html', // Use SPA navigation fallback
        navigateFallbackAllowlist: [/^(?!\/__).*/] // Don't cache certain assets like admin routes
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  // Add base URL configuration for Vercel deployment
  base: '/',
  // Handle 404s in development
  server: {
    historyApiFallback: true
  },
  // Handle 404s in production
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});
