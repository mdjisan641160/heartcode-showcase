import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // আপনার রিপোজিটরির নাম heartcode-showcase হলে নিচের লাইনটি ব্যবহার করুন
  base: "/heartcode-showcase/", 
})