import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cms } from './src/api/cms'

/**
 * Starts the cover story's request while the HTML is still being parsed.
 *
 * The home page's LCP is its cover image, and the image's URL only exists once
 * that CMS response arrives — so without this the request cannot even begin
 * until the app bundle has downloaded, parsed and run. The preload takes all of
 * that off the front of the chain; HeroSection's own `fetch` for the same URL
 * is then served from the preload cache rather than sent again.
 *
 * The URL comes from `cms.coverStory` itself, so it cannot drift out of step
 * with the query the app actually makes.
 */
const preloadCoverStory = {
  name: 'preload-cover-story',
  transformIndexHtml: () => [
    {
      tag: 'link',
      attrs: { rel: 'preload', as: 'fetch', crossorigin: 'anonymous', href: cms.coverStory.url },
      injectTo: 'head' as const,
    },
  ],
}

export default defineConfig({
  plugins: [react(), preloadCoverStory],
  server: {
    port: 5173,
    historyApiFallback: true
  },
  build: {
    rollupOptions: {
      output: {
        // React barely changes between releases, so keeping it in its own file
        // lets returning visitors reuse it after every site deploy instead of
        // re-downloading it inside the app bundle.
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client'],
        },
      },
    },
  },
})
