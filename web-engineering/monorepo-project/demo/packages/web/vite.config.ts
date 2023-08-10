import { defineConfig } from 'vite';
import config from 'config'

export default defineConfig({
  server: {
    port: config.WEB_DEV_PORT,
    proxy: {
      "/demo": {
        changeOrigin: true,
        target: `http://localhost:${config.SERVER_PORT}`
      }
    }
  }
})