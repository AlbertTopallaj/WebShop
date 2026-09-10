/*import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
        proxy: {
            "/api": {
                target: "http://localhost:5050",
                changeOrigin: true,

                // /api/carriers blir /carriers
                // hos json-server.
                rewrite: (path) =>
                    path.replace(/^\/api/, "")
            }
        }
    }
})*/

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],

    server: {
        proxy: {
            "/api": {
                target: "http://localhost:5050",
                changeOrigin: true,
                rewrite: (path) =>
                    path.replace(/^\/api/, "")
            }
        }
    }
})
