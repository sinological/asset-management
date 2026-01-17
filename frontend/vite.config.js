import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 每一次 build 都不一样（秒级）
const buildTime = new Date().toISOString()

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'inject-build-time',
      transformIndexHtml(html) {
        return html.replace(
          '<head>',
          `<head>
    <!-- BUILD_TIME: ${buildTime} -->
    <meta name="build-time" content="${buildTime}">`
        )
      }
    }
  ],

  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime)
  }
})

