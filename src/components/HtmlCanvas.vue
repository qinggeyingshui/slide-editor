<template>
  <div class="html-canvas-root" ref="rootRef" @mousedown.prevent="onMouseDown" @dblclick="onDblClick">
    <div class="slide-render" ref="slideRef" :style="slideStyle"></div>
    <div v-for="(os, i) in outlineStyles" :key="i" class="selection-outline" :style="os"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({ slide: Object })
const emit = defineEmits(['select-element', 'update-html'])

const rootRef = ref(null)
const slideRef = ref(null)
const selectedEls = ref([])  // multi-select
const outlineStyles = ref([])
const activeGroup = ref(null) // "entered" group for deep editing
let editingEl = null

// History stack for undo/redo
let history = []
let historyIndex = -1
const MAX_HISTORY = 50

const slideStyle = computed(() => {
  const s = props.slide?.slideStyle || ''
  return s + '; width:1280px; height:720px; position:relative; overflow:hidden;'
})

function renderSlide() {
  if (!slideRef.value || !props.slide) return
  slideRef.value.innerHTML = props.slide.innerHTML || ''
  selectedEls.value = []
  outlineStyles.value = []
  editingEl = null
  // Init history with current state
  history = [slideRef.value.innerHTML]
  historyIndex = 0
}

watch(() => props.slide, () => nextTick(renderSlide), { immediate: true })

onMounted(() => {
  renderSlide()
  document.addEventListener('paste', onPaste)
  document.addEventListener('keydown', onKeyDown)
  // Expose API on DOM element for parent access (workaround for ref=null HMR bug)
  if (rootRef.value) {
    rootRef.value.__api = { insertHtml, undo, redo, unlockFreeLayout, enterGroup }
  }
})

onUnmounted(() => {
  document.removeEventListener('paste', onPaste)
  document.removeEventListener('keydown', onKeyDown)
})

// --- Undo / Redo ---
function pushHistory() {
  if (!slideRef.value) return
  const html = slideRef.value.innerHTML
  // Remove future states if we undid
  if (historyIndex < history.length - 1) {
    history = history.slice(0, historyIndex + 1)
  }
  history.push(html)
  if (history.length > MAX_HISTORY) history.shift()
  historyIndex = history.length - 1
}

function undo() {
  if (historyIndex <= 0) return
  historyIndex--
  slideRef.value.innerHTML = history[historyIndex]
  deselectAll()
  emit('update-html', history[historyIndex])
}

function redo() {
  if (historyIndex >= history.length - 1) return
  historyIndex++
  slideRef.value.innerHTML = history[historyIndex]
  deselectAll()
  emit('update-html', history[historyIndex])
}

function onKeyDown(e) {
  if (editingEl) return // don't intercept while editing text
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    if (e.shiftKey) redo(); else undo()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault(); redo()
  }
  if (e.key === 'Escape') { deselectAll() }
}

// --- Paste image ---
function onPaste(e) {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault()
      const file = item.getAsFile()
      const reader = new FileReader()
      reader.onload = (ev) => {
        const img = document.createElement('img')
        img.src = ev.target.result
        img.className = 'free-img'
        img.style.cssText = 'position:absolute;left:100px;top:100px;width:300px;cursor:move;z-index:10;user-select:none;'
        slideRef.value.appendChild(img)
        pushHistory()
        saveHtml()
      }
      reader.readAsDataURL(file)
      break
    }
  }
}

// --- Selection & Drag ---
let dragState = null

function deselectAll() {
  selectedEls.value = []
  outlineStyles.value = []
  // If clicking outside the group, exit group mode
  activeGroup.value = null
  emit('select-element', null)
}

function enterGroup(groupEl) {
  activeGroup.value = groupEl
  deselectAllKeepGroup()
  // Convert group children to absolute for free dragging
  const sr = slideRef.value.getBoundingClientRect()
  const scale = sr.width / 1280
  const children = Array.from(groupEl.children).filter(c => c.tagName !== 'STYLE')
  const positions = children.map(el => {
    const r = el.getBoundingClientRect()
    return { el, left: (r.left - sr.left) / scale, top: (r.top - sr.top) / scale, width: r.width / scale }
  })
  positions.forEach(p => {
    p.el.style.position = 'absolute'
    p.el.style.left = Math.round(p.left) + 'px'
    p.el.style.top = Math.round(p.top) + 'px'
    p.el.style.width = Math.round(p.width) + 'px'
    p.el.style.margin = '0'
  })
  // Make group itself a positioning context
  groupEl.style.position = 'relative'
  groupEl.style.outline = '2px dashed #1a73e8'
}

function deselectAllKeepGroup() {
  selectedEls.value = []
  outlineStyles.value = []
  emit('select-element', null)
}

function selectElement(el) {
  selectedEls.value = [el]
  updateOutlines()
  emit('select-element', el)
}

function updateOutlines() {
  if (!slideRef.value) { outlineStyles.value = []; return }
  const scale = slideRef.value.getBoundingClientRect().width / 1280
  outlineStyles.value = selectedEls.value.map(el => {
    const r = el.getBoundingClientRect()
    const sr = slideRef.value.getBoundingClientRect()
    return {
      left: ((r.left - sr.left) / scale) + 'px',
      top: ((r.top - sr.top) / scale) + 'px',
      width: (r.width / scale) + 'px',
      height: (r.height / scale) + 'px'
    }
  })
}

function onMouseDown(e) {
  let el = e.target
  if (el === slideRef.value || el === rootRef.value) { deselectAll(); return }
  // Determine the effective container (may be a wrapper like .sg)
  const directChildren = Array.from(slideRef.value.children).filter(c => c.tagName !== 'STYLE')
  const wrapper = (directChildren.length === 1 && directChildren[0].children.length > 1) ? directChildren[0] : null
  const baseContainer = wrapper || slideRef.value

  // If we're inside an active group, use it as the container
  const container = activeGroup.value || baseContainer

  if (el === container || el === baseContainer) {
    // Clicking outside the group → exit group
    deselectAll(); return
  }

  // Walk up to find a direct child of the container
  while (el.parentElement && el.parentElement !== container) {
    el = el.parentElement
  }
  if (el === container || el === slideRef.value || el === baseContainer) { deselectAll(); return }

  // Shift+click for multi-select
  if (e.shiftKey) {
    const idx = selectedEls.value.indexOf(el)
    if (idx >= 0) {
      selectedEls.value.splice(idx, 1) // deselect if already selected
    } else {
      selectedEls.value.push(el)
    }
    updateOutlines()
    emit('select-element', el)
  } else {
    if (!selectedEls.value.includes(el)) {
      selectElement(el)
    }
  }

  // Start drag ONLY for absolute-positioned elements
  const isAbsolute = selectedEls.value.every(sel => getComputedStyle(sel).position === 'absolute')
  if (!isAbsolute) return // Flow layout: select only, no drag

  const scale = slideRef.value.getBoundingClientRect().width / 1280
  const startX = e.clientX, startY = e.clientY

  // Snapshot original positions
  const origins = selectedEls.value.map(sel => {
    return { el: sel, left: parseInt(sel.style.left)||0, top: parseInt(sel.style.top)||0 }
  })

  let moved = false
  function onMove(ev) {
    moved = true
    const dx = (ev.clientX - startX) / scale
    const dy = (ev.clientY - startY) / scale
    origins.forEach(o => {
      o.el.style.left = (o.left + dx) + 'px'
      o.el.style.top = (o.top + dy) + 'px'
    })
    updateOutlines()
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    if (moved) { pushHistory(); saveHtml() }
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function onDblClick(e) {
  let el = e.target
  if (el === slideRef.value || el === rootRef.value) return
  if (el.tagName === 'IMG') return

  // Determine the effective container
  const directChildren = Array.from(slideRef.value.children).filter(c => c.tagName !== 'STYLE')
  const wrapper = (directChildren.length === 1 && directChildren[0].children.length > 1) ? directChildren[0] : null
  const container = wrapper || slideRef.value

  // Walk up to find a direct child of the container (or activeGroup)
  const effectiveContainer = activeGroup.value || container
  let target = el
  while (target.parentElement && target.parentElement !== effectiveContainer) {
    target = target.parentElement
  }

  // If we're NOT inside a group and the target (direct child of container) has multiple children → enter group
  if (!activeGroup.value && target.children.length > 1) {
    enterGroup(target)
    return
  }

  // Otherwise: inline text editing
  el.contentEditable = 'true'
  el.focus()
  editingEl = el
  el.addEventListener('blur', () => {
    el.contentEditable = 'false'
    editingEl = null
    pushHistory()
    saveHtml()
  }, { once: true })
}

function saveHtml() {
  if (!slideRef.value) return
  emit('update-html', slideRef.value.innerHTML)
}

function insertHtml(html) {
  if (!slideRef.value) return
  slideRef.value.insertAdjacentHTML('beforeend', html)
  pushHistory()
  saveHtml()
}

function unlockFreeLayout() {
  if (!slideRef.value) return
  let container = slideRef.value
  // If only one non-STYLE child that's a wrapper (like .sg), go deeper
  const directChildren = Array.from(container.children).filter(el => el.tagName !== 'STYLE')
  if (directChildren.length === 1 && directChildren[0].children.length > 1) {
    container = directChildren[0]
    // Make wrapper non-draggable by forcing relative position
    container.style.position = 'relative'
    container.style.width = '100%'
    container.style.height = '100%'
  }
  const children = Array.from(container.children).filter(el => el.tagName !== 'STYLE')
  if (!children.length) return
  const sr = slideRef.value.getBoundingClientRect()
  const scale = sr.width / 1280
  // Snapshot all positions first
  const positions = children.map(el => {
    const r = el.getBoundingClientRect()
    return {
      el,
      left: (r.left - sr.left) / scale,
      top: (r.top - sr.top) / scale,
      width: r.width / scale,
      height: r.height / scale
    }
  })
  // Apply absolute positioning to all
  positions.forEach(p => {
    p.el.style.position = 'absolute'
    p.el.style.left = Math.round(p.left) + 'px'
    p.el.style.top = Math.round(p.top) + 'px'
    p.el.style.width = Math.round(p.width) + 'px'
    p.el.style.margin = '0'
  })
  pushHistory()
  saveHtml()
}

defineExpose({ insertHtml, undo, redo, unlockFreeLayout })
</script>

<style scoped>
.html-canvas-root { position: relative; width: 1280px; height: 720px; }
.slide-render { width: 100%; height: 100%; position: relative; overflow: hidden; }
.selection-outline {
  position: absolute; pointer-events: none;
  border: 2px solid #1a73e8; border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(26,115,232,0.3);
}
</style>
