import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Vite plugin: save API middleware
function savePlugin() {
  return {
    name: 'save-presentation',
    configureServer(server) {
      server.middlewares.use('/api/save', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        let body = ''
        req.on('data', chunk => body += chunk)
        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const filePath = path.resolve(__dirname, 'src/model/presentationData.js')
            const content = `// Auto-saved by slide-editor\n` +
              `export const presentationSlides = ${JSON.stringify(data.slides, null, 2)}\n\n` +
              `export const presentationCSS = ${JSON.stringify(data.css || '')}\n`
            fs.writeFileSync(filePath, content, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, time: new Date().toISOString() }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
          }
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), savePlugin()],
  server: { port: 3001, open: false }
})
