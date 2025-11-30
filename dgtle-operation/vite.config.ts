import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

export default defineConfig({
  base: '/', // 设置打包路径
  resolve: {
    alias: {
      // 设置别名
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8808,
    proxy: {
      '/api': {
        target: '/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [
    vue(),
    ElementPlus({
      // 开启样式自动导入
      useSource: true
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue'] // 自动导入vue3API
    }),
    Components({
      dts: false, // 关闭自动生成 components.d.ts
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass' //控制elementPlus组件样式的导入方式，不设置只能通过写css变量的方式覆盖
        })
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element.variable" as *;`
      }
    }
  }
})
