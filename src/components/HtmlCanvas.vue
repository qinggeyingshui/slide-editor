<template>
  <div class="html-canvas-root" ref="rootRef" @mousedown.prevent="onMouseDown" @dblclick="onDblClick">
    <div class="slide-render" ref="slideRef" :style="slideStyle"></div>
    <div v-for="(os, i) in outlineStyles" :key="i" class="selection-outline" :style="os"></div>
    <!-- Resize handles -->
    <template v-if="resizeHandles.length">
      <div v-for="(h, i) in resizeHandles" :key="'rh'+i"
        class="resize-handle" :class="'rh-'+h.cursor"
        :style="{ left: h.x+'px', top: h.y+'px', cursor: h.cursor+'-resize' }"
        @mousedown.stop.prevent="onResizeStart($event, h.dir)">
      </div>
    </template>
    <!-- Alignment guides -->
    <div v-for="(g, i) in guides" :key="'g'+i" class="align-guide" :style="g"></div>
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
const resizeHandles = ref([])
const guides = ref([])
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
    rootRef.value.__api = { insertHtml, undo, redo, unlockFreeLayout, enterGroup, pushHistory }
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

let clipboard = null
function onKeyDown(e) {
  if (editingEl) return // don't intercept while editing text
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    if (e.shiftKey) redo(); else undo()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault(); redo()
  }
  // Delete selected element
  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEls.value.length) {
    e.preventDefault()
    const el = selectedEls.value[0]
    const next = el.nextElementSibling || el.previousElementSibling
    el.remove()
    pushHistory()
    saveHtml()
    if (next) selectElement(next)
    else deselectAll()
  }
  // Copy
  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedEls.value.length) {
    e.preventDefault()
    clipboard = selectedEls.value[0].outerHTML
  }
  // Paste (clone)
  if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboard && slideRef.value) {
    e.preventDefault()
    const temp = document.createElement('div')
    temp.innerHTML = clipboard
    const clone = temp.firstElementChild
    if (clone) {
      // Offset position slightly so it's visible
      const left = parseInt(clone.style.left || '0') + 20
      const top = parseInt(clone.style.top || '0') + 20
      clone.style.left = left + 'px'
      clone.style.top = top + 'px'
      slideRef.value.appendChild(clone)
      pushHistory()
      saveHtml()
      selectElement(clone)
    }
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
  if (!slideRef.value) { outlineStyles.value = []; resizeHandles.value = []; return }
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
  // Resize handles (only for single selection)
  if (selectedEls.value.length === 1) {
    const el = selectedEls.value[0]
    const r = el.getBoundingClientRect()
    const sr = slideRef.value.getBoundingClientRect()
    const x = (r.left - sr.left) / scale, y = (r.top - sr.top) / scale
    const w = r.width / scale, h = r.height / scale
    const hs = 4 // half handle size
    resizeHandles.value = [
      { x: x - hs, y: y - hs, dir: 'nw', cursor: 'nw' },
      { x: x + w/2 - hs, y: y - hs, dir: 'n', cursor: 'n' },
      { x: x + w - hs, y: y - hs, dir: 'ne', cursor: 'ne' },
      { x: x + w - hs, y: y + h/2 - hs, dir: 'e', cursor: 'e' },
      { x: x + w - hs, y: y + h - hs, dir: 'se', cursor: 'se' },
      { x: x + w/2 - hs, y: y + h - hs, dir: 's', cursor: 's' },
      { x: x - hs, y: y + h - hs, dir: 'sw', cursor: 'sw' },
      { x: x - hs, y: y + h/2 - hs, dir: 'w', cursor: 'w' },
    ]
  } else {
    resizeHandles.value = []
  }
}

function onResizeStart(e, dir) {
  if (selectedEls.value.length !== 1) return
  const el = selectedEls.value[0]
  const scale = slideRef.value.getBoundingClientRect().width / 1280
  const startX = e.clientX, startY = e.clientY
  const origL = parseInt(el.style.left)||0, origT = parseInt(el.style.top)||0
  const origW = parseInt(el.style.width)||el.offsetWidth/scale
  const origH = parseInt(el.style.height)||el.offsetHeight/scale

  function onMove(ev) {
    const dx = (ev.clientX - startX) / scale
    const dy = (ev.clientY - startY) / scale
    let nl = origL, nt = origT, nw = origW, nh = origH
    if (dir.includes('e')) nw = Math.max(20, origW + dx)
    if (dir.includes('w')) { nw = Math.max(20, origW - dx); nl = origL + dx }
    if (dir.includes('s')) nh = Math.max(20, origH + dy)
    if (dir.includes('n')) { nh = Math.max(20, origH - dy); nt = origT + dy }
    el.style.left = nl + 'px'; el.style.top = nt + 'px'
    el.style.width = nw + 'px'; el.style.height = nh + 'px'
    updateOutlines()
    computeGuides(el, nl, nt, nw, nh)
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    guides.value = []
    pushHistory(); saveHtml()
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function computeGuides(activeEl, ax, ay, aw, ah) {
  const SNAP = 5
  const newGuides = []
  const acx = ax + aw/2, acy = ay + ah/2
  const ar = ax + aw, ab = ay + ah
  // Slide center guides
  if (Math.abs(acx - 640) < SNAP) newGuides.push({ left:'640px', top:'0', width:'1px', height:'720px', background:'#e91e63' })
  if (Math.abs(acy - 360) < SNAP) newGuides.push({ left:'0', top:'360px', width:'1280px', height:'1px', background:'#e91e63' })
  // Compare with siblings
  const siblings = Array.from(slideRef.value.children).filter(c => c !== activeEl && c.style.position === 'absolute')
  for (const sib of siblings) {
    const sl = parseInt(sib.style.left)||0, st = parseInt(sib.style.top)||0
    const sw = parseInt(sib.style.width)||sib.offsetWidth, sh = parseInt(sib.style.height)||sib.offsetHeight
    const scx = sl + sw/2, scy = st + sh/2
    // Vertical alignment
    if (Math.abs(ax - sl) < SNAP) newGuides.push({ left:sl+'px', top:'0', width:'1px', height:'720px', background:'#2196f3' })
    if (Math.abs(ar - (sl+sw)) < SNAP) newGuides.push({ left:(sl+sw)+'px', top:'0', width:'1px', height:'720px', background:'#2196f3' })
    if (Math.abs(acx - scx) < SNAP) newGuides.push({ left:scx+'px', top:'0', width:'1px', height:'720px', background:'#2196f3' })
    // Horizontal alignment
    if (Math.abs(ay - st) < SNAP) newGuides.push({ left:'0', top:st+'px', width:'1280px', height:'1px', background:'#2196f3' })
    if (Math.abs(ab - (st+sh)) < SNAP) newGuides.push({ left:'0', top:(st+sh)+'px', width:'1280px', height:'1px', background:'#2196f3' })
    if (Math.abs(acy - scy) < SNAP) newGuides.push({ left:'0', top:scy+'px', width:'1280px', height:'1px', background:'#2196f3' })
  }
  guides.value = newGuides.slice(0, 6) // limit to avoid clutter
}

function onMouseDown(e) {
  let el = e.target
  if (el === slideRef.value || el === rootRef.value) { deselectAll(); return }

  // "Deep select": if clicking inside the currently selected element,
  // select the clicked child directly (don't bubble up to top-level absolute)
  const currentSel = selectedEls.value[0]
  if (currentSel && currentSel.contains(el) && el !== currentSel) {
    // Use the direct click target (deepest element)
    // But walk up to find a meaningful element (has siblings or is a direct child of currentSel)
    let candidate = el
    while (candidate.parentElement && candidate.parentElement !== currentSel) {
      candidate = candidate.parentElement
    }
    selectElement(candidate)
    emit('select-element', candidate)
    return
  }

  // In full-absolute mode: find the nearest ancestor with position:absolute
  while (el && el !== slideRef.value && el !== rootRef.value) {
    if (el.style.position === 'absolute' || getComputedStyle(el).position === 'absolute') break
    el = el.parentElement
  }
  if (!el || el === slideRef.value || el === rootRef.value) { deselectAll(); return }

  // Shift+click for multi-select
  if (e.shiftKey) {
    const idx = selectedEls.value.indexOf(el)
    if (idx >= 0) {
      selectedEls.value.splice(idx, 1)
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

  // Drag
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
    // Alignment guides for single element drag
    if (origins.length === 1) {
      const o = origins[0]
      const nl = o.left + dx, nt = o.top + dy
      const nw = parseInt(o.el.style.width)||o.el.offsetWidth/scale
      const nh = parseInt(o.el.style.height)||o.el.offsetHeight/scale
      computeGuides(o.el, nl, nt, nw, nh)
    }
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    guides.value = []
    if (moved) { pushHistory(); saveHtml() }
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function onDblClick(e) {
  // Allow contentEditable on text-bearing elements
  let el = e.target
  if (el === slideRef.value || el === rootRef.value) return
  if (el.tagName === 'IMG') return
  
  // If element has no text content, skip
  if (!el.textContent.trim()) return
  
  // If element contains block-level children (div, section, ul, etc.), skip
  const blockTags = ['DIV', 'SECTION', 'UL', 'OL', 'TABLE', 'NAV', 'HEADER', 'FOOTER', 'ARTICLE']
  const hasBlockChildren = Array.from(el.children).some(c => blockTags.includes(c.tagName))
  if (hasBlockChildren) return
  
  // Safe to edit: text element (may contain inline spans)
  el.contentEditable = 'true'
  el.focus()
  el.addEventListener('blur', () => {
    el.contentEditable = 'false'
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

defineExpose({ insertHtml, undo, redo })
</script>

<style scoped>
.html-canvas-root { position: relative; width: 1280px; height: 720px; }
.slide-render { width: 100%; height: 100%; position: relative; overflow: hidden; }
.selection-outline {
  position: absolute; pointer-events: none;
  border: 2px solid #1a73e8; border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(26,115,232,0.3);
}
.resize-handle {
  position: absolute; width: 10px; height: 10px;
  background: #fff; border: 2px solid #1a73e8; border-radius: 2px;
  z-index: 100;
}
.rh-nw { cursor: nw-resize; }
.rh-n { cursor: n-resize; }
.rh-ne { cursor: ne-resize; }
.rh-e { cursor: e-resize; }
.rh-se { cursor: se-resize; }
.rh-s { cursor: s-resize; }
.rh-sw { cursor: sw-resize; }
.rh-w { cursor: w-resize; }
.align-guide {
  position: absolute; pointer-events: none; z-index: 99; opacity: 0.7;
}
</style>
