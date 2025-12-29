import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    proxy: {             // advantage of using proxy is that in development we don't have to hardcode the backend server url in our frontend code, when we use proxy, we can just make request to our own frontend server and it will forward the request to the backend server, so now the browser will think that it is making request to the same server and it won't block the request and cause CORS error, in this way we can avoid CORS error without any whitelisting of frontend url or any proper CORS setup in backend server during development, we obviously need to do proper CORS setup in production
      '/api': 'https://fintracker-server-twcf.onrender.com/api/v1'              // now wherever the frontend makes request to a route starting with /api, it will be forwarded to the mentioned backend server i.e. https://fintracker-server-twcf.onrender.com/api/v1
    }
  },
    preview: {
    allowedHosts: ['.onrender.com']
  }
})