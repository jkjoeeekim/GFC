import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Defaults to '/' for local dev and root-domain hosting; the GitHub Pages
// workflow sets BASE_PATH=/GFC/ because the site is served from a subpath.
const base = process.env.BASE_PATH || '/'

// Content and components reference public files as root-relative string
// literals ("/images/..."). Vite only rebases those in HTML and CSS, so prefix
// them in source modules too when building for a subpath.
function rebasePublicPaths(): Plugin {
  const pattern = /(["'])\/(images|vendor|licenses)\//g
  return {
    name: 'rebase-public-paths',
    enforce: 'pre',
    transform(code, id) {
      if (base === '/' || !/\/src\/.*\.(tsx?|json)$/.test(id)) return null
      return { code: code.replace(pattern, `$1${base}$2/`), map: null }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), rebasePublicPaths()],
})
