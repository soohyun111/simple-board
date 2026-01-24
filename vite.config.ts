import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
            react(),
            tailwindcss(), //런타임에서는 정상 동작하지만 TypeScript 타입 정의와 Vite Plugin 타입 간 불일치로 경고 발생
          ],
})
