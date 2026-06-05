import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GITHUB_PAGES=true npm run build  → sets base for GitHub Pages
// Normal `npm run build`           → works for Vercel / Netlify
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/kalmanvis/' : '/',
})
