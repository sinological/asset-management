import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(
      new Date().toISOString()
    )
  }
});
