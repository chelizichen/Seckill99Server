import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:25789/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/seckill99server/') // 不可以省略rewrite
      },
    }
  }
})
