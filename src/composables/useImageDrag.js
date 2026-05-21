import { ref } from 'vue'

export function useImageDrag() {
  const imgDrag = ref(null)
  const imgResize = ref(null)

  function startImgDrag(e, block) {
    if (e.target.classList.contains('img-resize-handle')) return
    e.preventDefault()
    const rect = e.target.closest('.img-resizable').getBoundingClientRect()
    imgDrag.value = {
      blockId: block.id,
      startX: e.clientX, startY: e.clientY,
      origLeft: block.imgX || 0, origTop: block.imgY || 0
    }
    const onMove = (ev) => {
      if (!imgDrag.value) return
      block.imgX = imgDrag.value.origLeft + (ev.clientX - imgDrag.value.startX)
      block.imgY = imgDrag.value.origTop + (ev.clientY - imgDrag.value.startY)
    }
    const onUp = () => {
      imgDrag.value = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  function startImgResize(e, block) {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const origW = block.imgWidth || 300
    const onMove = (ev) => {
      block.imgWidth = Math.max(50, origW + (ev.clientX - startX))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  function handleImageUpload(e, currentSlide, addBlock) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const block = { id: 'b' + Math.random().toString(36).slice(2,9), type: 'image', content: '', src: ev.target.result, style: {}, imgWidth: 300, imgX: 0, imgY: 0 }
      currentSlide.value.blocks.push(block)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return { startImgDrag, startImgResize, handleImageUpload }
}
