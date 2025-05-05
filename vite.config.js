import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Changed from 'prompt' to 'autoUpdate' for better user experience
      injectRegister: 'auto',     // Automatically inject the service worker register
      includeAssets: ['favicon.ico', 'robots.txt', 'logo.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Leafalyze',
        short_name: 'Leafalyze',
        description: 'A Progressive Web App for Raspberry Pi',
        theme_color: '#ffffff',
        start_url: '/',
        id: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/logo.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Leafalyze Dashboard'
          },
          {
            src: '/logo.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Leafalyze Mobile View'
          }
        ],
        shortcuts: [
          {
            name: 'Dashboard',
            url: '/dashboard',
            description: 'View your dashboard'
          }
        ],
        categories: ['productivity', 'utilities']
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: new RegExp('^https://leafalyze-frontend-kdly\\.vercel\\.app/.*', 'i'),
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
          },
          {
            urlPattern: /\.(js|css|png|jpg|jpeg|svg|ico)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // Cache for 7 days
              }
            }
          }
        ],
        navigateFallback: '/index.html', // Use SPA navigation fallback
        navigateFallbackDenylist: [/^\/api/, /\/admin/] // Don't cache certain assets
      },
      devOptions: {
        enabled: true,
        type: 'module'
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