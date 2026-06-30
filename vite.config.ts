import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` must match the GitHub Pages sub-path (https://<user>.github.io/splay-app/)
// for the production build only; local dev/preview stay at the root path.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/splay-app/' : '/',
  plugins: [react()],
}))
