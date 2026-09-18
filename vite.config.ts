import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
