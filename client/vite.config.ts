import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(), '')
  return{
  plugins: [react()],
  base:env.BASE,
  server: {
    proxy: {
      '/seckill99server': {
        target: 'http://localhost:25789/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/seckill99server/') // 不可以省略rewrite
      },
    }
  }}
})
