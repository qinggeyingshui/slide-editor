import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Vite plugin: save API middleware
function savePlugin() {
  return {
    name: 'save-presentation',
    configureServer(server) {
      // Export PPTX via screenshot script
      server.middlewares.use('/api/export-pptx', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        const outPath = path.resolve(__dirname, 'exported.pptx')
        const scriptPath = path.resolve(__dirname, 'scripts/export_pptx.py')
        const proc = spawn('python', [scriptPath, '--url', 'http://localhost:3001', '-o', outPath])
        let stderr = ''
        proc.stderr.on('data', d => stderr += d)
        proc.stdout.on('data', d => process.stdout.write(d))
        proc.on('close', code => {
          if (code === 0 && fs.existsSync(outPath)) {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
            res.setHeader('Content-Disposition', 'attachment; filename="presentation.pptx"')
            const buf = fs.readFileSync(outPath)
            res.end(buf)
          } else {
            res.statusCode = 500
            res.end(JSON.stringify({ error: stderr || 'export failed' }))
          }
        })
      })

      // Import PPTX via pptx2slides.py
      server.middlewares.use('/api/import-pptx', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        const chunks = []
        req.on('data', c => chunks.push(c))
        req.on('end', () => {
          const tmpFile = path.resolve(__dirname, 'scripts/_upload.pptx')
          fs.writeFileSync(tmpFile, Buffer.concat(chunks))
          const scriptPath = path.resolve(__dirname, 'scripts/pptx2slides.py')
          const proc = spawn('python', [scriptPath, tmpFile], { cwd: __dirname })
          let stderr = ''
          proc.stderr.on('data', d => stderr += d)
          proc.stdout.on('data', d => process.stdout.write(d))
          proc.on('close', code => {
            try { fs.unlinkSync(tmpFile) } catch(e) {}
            if (code !== 0) { res.statusCode = 500; res.end(JSON.stringify({ error: stderr })); return }
            // Read generated presentationData.js and extract slides
            const dataFile = path.resolve(__dirname, 'src/model/presentationData.js')
            const content = fs.readFileSync(dataFile, 'utf-8')
            // Extract the slides array from the JS module
            const match = content.match(/export const (?:slides|presentationSlides)\s*=\s*(\[[\s\S]*?\]);\s*\n/)
            if (match) {
              res.setHeader('Content-Type', 'application/json')
              res.end(match[1])
            } else {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Failed to parse generated slides' }))
            }
          })
        })
      })

      server.middlewares.use('/api/save', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        let body = ''
        req.on('data', chunk => body += chunk)
        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const filePath = path.resolve(__dirname, 'src/model/presentationData.js')
            const content = `// Auto-saved by slide-editor\n` +
              `export const slides = ${JSON.stringify(data.slides, null, 2)}\n\n` +
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
