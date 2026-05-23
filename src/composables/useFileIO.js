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

  return { saveStatus, saveToFile, exportJSON, importJSON, exportPPTX, importPPTX }
}
