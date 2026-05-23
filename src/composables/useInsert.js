export function useInsert(getCanvasApi) {
  function insertTextBox() {
    const html = `<div style="position:absolute;left:${100+Math.random()*400|0}px;top:${100+Math.random()*300|0}px;width:240px;padding:12px 16px;font-size:18px;color:#333;background:rgba(255,255,255,0.9);border:1px solid #ddd;border-radius:4px;cursor:move;">双击编辑文本</div>`
    const api = getCanvasApi()
    if (api?.insertHtml) api.insertHtml(html)
  }

  function insertLatex() {
    const latex = prompt('输入 LaTeX 公式：', 'E = mc^2')
    if (!latex) return
    let rendered = ''
    try {
      rendered = window.katex.renderToString(latex, { throwOnError: false, displayMode: false })
    } catch (e) {
      rendered = `<span style="color:red;">公式错误: ${e.message}</span>`
    }
    const api = getCanvasApi()
    // If a text element is selected, insert inline
    const sel = api?.getSelectedEl?.()
    if (sel && sel.isContentEditable !== false && sel.tagName === 'DIV') {
      sel.innerHTML += `<span class="latex-inline" data-latex="${latex.replace(/"/g, '&quot;')}">${rendered}</span>`
      return
    }
    // Otherwise create a text-box style container with the formula
    const html = `<div class="latex-block" data-latex="${latex.replace(/"/g, '&quot;')}" style="position:absolute;left:${100+Math.random()*400|0}px;top:${100+Math.random()*300|0}px;width:240px;padding:12px 16px;font-size:18px;color:#333;background:rgba(255,255,255,0.9);border:1px solid #ddd;border-radius:4px;cursor:move;">${rendered}</div>`
    if (api?.insertHtml) api.insertHtml(html)
  }

  function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = `<img src="${ev.target.result}" style="position:absolute;left:100px;top:100px;width:300px;cursor:move;z-index:10;user-select:none;" class="free-img" />`
      const api = getCanvasApi()
      if (api?.insertHtml) api.insertHtml(img)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleVideoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const video = `<video src="${url}" controls style="position:absolute;left:80px;top:80px;width:480px;cursor:move;z-index:10;user-select:none;border-radius:8px;" class="free-video"></video>`
    const api = getCanvasApi()
    if (api?.insertHtml) api.insertHtml(video)
    e.target.value = ''
  }

  return { insertTextBox, insertLatex, handleImageUpload, handleVideoUpload }
}
