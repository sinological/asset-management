import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 每次构建生成唯一标记
const buildTime = new Date().toISOString()

export default defineConfig({
  plugins: [
    vue(),

    /**
     * 强制修改 index.html，保证 Cloudflare Pages 识别为新版本
     */
    {
      name: 'inject-build-meta',
      transformIndexHtml(html) {
        return html.replace(
          /<head>/i,
          `<head>
    <!-- BUILD_TIME: ${buildTime} -->
    <meta name="build-time" content="${buildTime}">
`
        )
      }
    }
  ],

  /**
   * 在 JS / Vue 中可直接使用
   * import.meta.env.VITE_BUILD_TIME
   */
  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime)
  },

  build: {
    sourcemap: false,
    outDir: 'dist'
  }
})
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
