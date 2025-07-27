import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from "unplugin-auto-import/vite";
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImport({
    imports: ["vue"]
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: [".vue", ".js"]
  },
  server: {
    port: 9999
  },
  publicDir: 'public'  // 显式指定 public 目录为静态资源目录
})
