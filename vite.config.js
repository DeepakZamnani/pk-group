import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // pre-cache only app shell — JS, CSS, HTML, fonts
        // images are handled by runtime CacheFirst below (cached on first access)
        globPatterns: ['**/*.{js,css,html,ttf,woff,woff2}'],

        // skip videos — too large for Cache API, served via CDN instead
        globIgnores: ['**/*.{mp4,mov,webm}'],

        runtimeCaching: [
          {
            // images — cache first, serve from cache, refresh in background after 30 days
            urlPattern: /\.(?:png|jpe?g|svg|gif|webp)(\?.*)?$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pk-images',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // fonts — cache first, 1 year
            urlPattern: /\.(?:ttf|woff2?)(\?.*)?$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pk-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // videos — always fetch from network (CDN handles caching at the edge)
            urlPattern: /\.(?:mp4|mov|webm)(\?.*)?$/i,
            handler: 'NetworkOnly',
          },
        ],
      },
      manifest: {
        name: 'PK Group',
        short_name: 'PK Group',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
      },
    }),
  ],
})
