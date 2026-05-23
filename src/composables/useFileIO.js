import { ref } from 'vue'

export function useFileIO(slides, currentIndex) {
  const saveStatus = ref('')

  async function saveToFile() {
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides: slides.value })
      })
      const data = await res.json()
      if (data.ok) {
        saveStatus.value = '✓ 已保存'
        setTimeout(() => saveStatus.value = '', 2000)
      }
    } catch (e) {
      saveStatus.value = '⚠ 保存失败'
      setTimeout(() => saveStatus.value = '', 3000)
    }
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(slides.value, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'presentation.json'; a.click()
    URL.revokeObjectURL(url)
  }

  function importJSON(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (Array.isArray(data) && data.length > 0) {
          slides.value = data
          currentIndex.value = 0
          saveStatus.value = '✓ 已导入'
          setTimeout(() => saveStatus.value = '', 2000)
        }
      } catch (err) { alert('JSON 格式错误') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function exportPPTX() {
    saveStatus.value = '导出中...'
    try {
      const res = await fetch('/api/export-pptx', { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).error || 'export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'presentation.pptx'; a.click()
      URL.revokeObjectURL(url)
      saveStatus.value = '✓ 已导出PPTX'
    } catch (e) { saveStatus.value = '✗ ' + e.message }
    setTimeout(() => saveStatus.value = '', 3000)
  }

  async function importPPTX(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    saveStatus.value = '导入中...'
    try {
      const res = await fetch('/api/import-pptx', { method: 'POST', body: await file.arrayBuffer() })
      if (!res.ok) throw new Error((await res.json()).error || 'import failed')
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        slides.value = data
        currentIndex.value = 0
        saveStatus.value = '✓ 已导入PPTX'
      }
    } catch (e) { saveStatus.value = '✗ ' + e.message }
    setTimeout(() => saveStatus.value = '', 3000)
  }

  function exportHTML() {
    const pages = slides.value.map((s, i) =>
      `<div style="position:relative;width:960px;height:540px;overflow:hidden;margin:20px auto;box-shadow:0 2px 12px rgba(0,0,0,.15);">${s.innerHTML}</div>`
    ).join('\n')
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Presentation</title><style>body{margin:0;background:#222;padding:20px 0;}</style></head><body>\n${pages}\n</body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'presentation.html'; a.click()
    URL.revokeObjectURL(url)
  }

  function importHTML(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(reader.result, 'text/html')
      // Find slide containers: direct children of body with 960x540 size, or sections/divs with class slide
      let containers = [...doc.querySelectorAll('body > div, body > section')]
      if (containers.length === 0) { alert('未找到幻灯片内容'); return }
      const newSlides = containers.map((el, i) => ({ id: Date.now() + i, innerHTML: el.innerHTML || el.outerHTML }))
      if (newSlides.length > 0) {
        slides.value = newSlides
        currentIndex.value = 0
        saveStatus.value = '✓ 已导入HTML'
        setTimeout(() => saveStatus.value = '', 2000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return { saveStatus, saveToFile, exportJSON, importJSON, exportPPTX, importPPTX, exportHTML, importHTML }
}
