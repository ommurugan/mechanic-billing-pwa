
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              networkTimeoutSeconds: 3
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true // Enable in development for testing
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'OM MURUGAN AUTO WORKS - Billing System',
        short_name: 'Auto Bill Guru',
        description: 'Complete billing solution for automotive services with GST support',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['business', 'productivity', 'finance'],
        lang: 'en',
        dir: 'ltr',
        prefer_related_applications: false,
        icons: [
          {
            src: '/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: '/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Auto Bill Guru Dashboard'
          },
          {
            src: '/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png',
            sizes: '640x1136',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Auto Bill Guru Mobile'
          }
        ],
        shortcuts: [
          {
            name: "Create Invoice",
            short_name: "New Invoice",
            description: "Create a new invoice quickly",
            url: "/invoices",
            icons: [{ src: "/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png", sizes: "96x96" }]
          },
          {
            name: "View Reports",
            short_name: "Reports",
            description: "View business reports and analytics",
            url: "/reports",
            icons: [{ src: "/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png", sizes: "96x96" }]
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
