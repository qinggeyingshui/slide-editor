import { ref, computed } from 'vue'
import { uid, createBlock, createSlide } from '../model/types.js'
import { slides as defaultSlides } from '../model/presentationData.js'

export function useSlides() {
  const slides = ref(defaultSlides.map((s, i) => ({ id: s.id || uid(), innerHTML: s.innerHTML, shapes: s.shapes || [] })))
  const currentIndex = ref(0)
  const selected = ref(null)

  const currentSlide = computed(() => slides.value[currentIndex.value])
  const selectedBlock = computed(() => {
    if (!selected.value || !currentSlide.value) return null
    return currentSlide.value.blocks.find(b => b.id === selected.value)
  })

  function addSlide(template) {
    const s = createSlide(template)
    if (template === 'title') {
      s.bgColor = '#1A1A2E'
      s.blocks = [
        createBlock('heading', '新标题', { fontSize: '36px', color: '#FFD93D', fontWeight: 'bold', textAlign: 'center' }),
        createBlock('text', '副标题', { fontSize: '18px', color: '#FFF8EE', textAlign: 'center' })
      ]
    } else if (template === 'content') {
      s.blocks = [
        createBlock('heading', '内容标题', { fontSize: '28px', color: '#1A1A2E', fontWeight: 'bold' }),
        createBlock('text', '在此输入内容...', { fontSize: '16px', color: '#2D2D4E' })
      ]
    }
    slides.value.splice(currentIndex.value + 1, 0, s)
    currentIndex.value++
    selected.value = null
  }

  function deleteSlide() {
    if (slides.value.length <= 1) return
    slides.value.splice(currentIndex.value, 1)
    if (currentIndex.value >= slides.value.length) currentIndex.value = slides.value.length - 1
  }

  function duplicateSlide() {
    const copy = JSON.parse(JSON.stringify(currentSlide.value))
    copy.id = uid()
    copy.blocks.forEach(b => b.id = uid())
    slides.value.splice(currentIndex.value + 1, 0, copy)
    currentIndex.value++
  }

  function addBlock(type) {
    const block = createBlock(type, type === 'heading' ? '新标题' : type === 'list' ? '<ul><li>项目</li></ul>' : '新文本')
    if (type === 'heading') block.style = { fontSize: '28px', color: '#1A1A2E', fontWeight: 'bold' }
    else block.style = { fontSize: '16px', color: '#2D2D4E' }
    currentSlide.value.blocks.push(block)
    selected.value = block.id
  }

  function deleteBlock() {
    if (!selected.value) return
    const idx = currentSlide.value.blocks.findIndex(b => b.id === selected.value)
    if (idx >= 0) currentSlide.value.blocks.splice(idx, 1)
    selected.value = null
  }

  function selectBlock(id) { selected.value = id }
  function clearSelection() { selected.value = null }

  // Drag reorder
  const dragIdx = ref(null)
  function dragStart(i) { dragIdx.value = i }
  function drop(i) {
    if (dragIdx.value === null || dragIdx.value === i) return
    const blocks = currentSlide.value.blocks
    const [moved] = blocks.splice(dragIdx.value, 1)
    blocks.splice(i, 0, moved)
    dragIdx.value = null
  }

  function onEdit(e, block) {
    block.content = e.target.innerHTML
  }

  function setBlockStyle(prop, val) {
    if (!selectedBlock.value) return
    if (!selectedBlock.value.style) selectedBlock.value.style = {}
    selectedBlock.value.style[prop] = val
  }

  return {
    slides, currentIndex, selected, currentSlide, selectedBlock,
    addSlide, deleteSlide, duplicateSlide,
    addBlock, deleteBlock, selectBlock, clearSelection,
    dragStart, drop, onEdit, setBlockStyle, dragIdx
  }
}
