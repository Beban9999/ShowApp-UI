import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [vue({
    template:{
      compilerOptions: {
        isCustomElement: tagName => {
          return tagName === 'vue-advanced-chat' || tagName === 'emoji-picker'
        }
      }
    }
  }),
  Components({
    resolvers: [
      PrimeVueResolver(),
    ]
  })],
})
