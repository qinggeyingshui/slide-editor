<template>
  <div class="html-canvas-root" ref="rootRef" @mousedown.prevent="onMouseDown" @dblclick="onDblClick">
    <div class="slide-render" ref="slideRef" :style="slideStyle"></div>
    <div class="overlay-layer">
      <div v-for="(os, i) in outlineStyles" :key="i" class="selection-outline" :style="os"></div>
      <!-- Resize handles -->
      <!-- Marquee selection box -->
      <div v-if="marquee" class="marquee-box" :style="marqueeStyle"></div>
      <template v-if="resizeHandles.length">
        <div v-for="(h, i) in resizeHandles" :key="'rh'+i"
          class="resize-handle" :class="'rh-'+h.cursor"
          :style="{ left: h.x+'px', top: h.y+'px', cursor: h.cursor+'-resize' }"
          @mousedown.stop.prevent="onResizeStart($event, h.dir)">
        </div>
      </template>
      <!-- Rotation handle -->
      <div v-if="rotateHandle" class="rotate-handle"
        :style="{ left: rotateHandle.x+'px', top: rotateHandle.y+'px' }"
        @mousedown.stop.prevent="onRotateStart($event)">
      </div>
      <!-- Alignment guides -->
      <div v-for="(g, i) in guides" :key="'g'+i" class="align-guide" :style="g"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, nextTick, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({ slide: Object })
const emit = defineEmits(['select-element', 'update-html'])

const rootRef = ref(null)
const slideRef = ref(null)
const selectedEls = ref([])  // multi-select
const outlineStyles = ref([])
const resizeHandles = ref([])
const rotateHandle = ref(null)
const guides = ref([])
const marquee = ref(null) // { startX, startY, x, y, w, h }
const marqueeStyle = computed(() => {
  if (!marquee.value) return {}
  const m = marquee.value
  return {
    position: 'absolute',
    left: m.x + 'px', top: m.y + 'px',
    width: m.w + 'px', height: m.h + 'px',
    border: '1px dashed #1a73e8',
    background: 'rgba(26,115,232,0.08)',
    pointerEvents: 'none',
    zIndex: 9999
  }
})
const activeGroup = ref(null) // "entered" group for deep editing
let editingEl = null

// History stack for undo/redo
let history = []
let historyIndex = -1
const MAX_HISTORY = 50

const slideStyle = computed(() => {
  const s = props.slide?.slideStyle || ''
  return s + '; width:960px; height:540px; position:relative; overflow:hidden;'
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
  // Render LaTeX formulas
  nextTick(() => {
    if (window.katex && slideRef.value) {
      slideRef.value.querySelectorAll('*').forEach(el => {
        if (el.children.length === 0 && el.textContent.includes('$$')) {
          el.innerHTML = el.innerHTML.replace(/\$\$(.+?)\$\$/g, (_, tex) => {
            try { return katex.renderToString(tex, { displayMode: true, throwOnError: false }) } catch(e) { return tex }
          })
        }
        if (el.children.length === 0 && el.textContent.includes('$')) {
          el.innerHTML = el.innerHTML.replace(/\$(.+?)\$/g, (_, tex) => {
            try { return katex.renderToString(tex, { displayMode: false, throwOnError: false }) } catch(e) { return tex }
          })
        }
      })
    }
    // Render ECharts blocks
    if (slideRef.value) {
      slideRef.value.querySelectorAll('[data-echarts]').forEach(el => {
        try {
          const opt = JSON.parse(el.getAttribute('data-echarts'))
          const instance = echarts.init(el, null, { renderer: 'svg' })
          instance.setOption(opt)
        } catch(e) { /* skip invalid */ }
      })
    }
  })
}

watch(() => props.slide, () => nextTick(renderSlide), { immediate: true })

onMounted(() => {
  renderSlide()
  document.addEventListener('paste', onPaste)
  document.addEventListener('keydown', onKeyDown)
  // Expose API on DOM element for parent access
  if (rootRef.value) {
    rootRef.value.__api = { insertHtml, undo, redo, unlockFreeLayout, enterGroup, pushHistory, getSelectedEl: () => selectedEls.value[0] || null }
  }
})

// Ensure __api is always bound (survives HMR)
watchEffect(() => {
  if (rootRef.value && !rootRef.value.__api) {
    rootRef.value.__api = { insertHtml, undo, redo, unlockFreeLayout, enterGroup, pushHistory, getSelectedEl: () => selectedEls.value[0] || null }
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
  // Don't intercept when focus is in toolbar inputs (font select, size input, etc.)
  const tag = e.target.tagName
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    if (e.shiftKey) redo(); else undo()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault(); redo()
  }
  // Delete selected element
  if (e.key === 'Delete' && selectedEls.value.length) {
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
  if (e.key === 'Escape') {
    if (activeGroup.value) {
      activeGroup.value.style.outline = ''
      activeGroup.value = null
      deselectAllKeepGroup()
    } else {
      deselectAll()
    }
  }
  // Select All: Ctrl+A
  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    e.preventDefault()
    if (slideRef.value) {
      const container = activeGroup.value || slideRef.value
      const children = Array.from(container.children)
      selectedEls.value = children.filter(c => c.nodeType === 1)
      updateOutlines()
    }
    return
  }
  // Group: Ctrl+G
  if ((e.ctrlKey || e.metaKey) && e.key === 'g' && !e.shiftKey) {
    e.preventDefault()
    groupSelected()
  }
  // Ungroup: Ctrl+Shift+G
  if ((e.ctrlKey || e.metaKey) && e.key === 'G' && e.shiftKey) {
    e.preventDefault()
    ungroupSelected()
  }
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

// --- Group / Ungroup ---
function groupSelected() {
  if (selectedEls.value.length < 2) return
  const scale = slideRef.value.getBoundingClientRect().width / 960
  // Calculate bounding box of all selected elements
  let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity
  for (const el of selectedEls.value) {
    const l = parseInt(el.style.left) || 0
    const t = parseInt(el.style.top) || 0
    const w = parseInt(el.style.width) || el.offsetWidth / scale
    const h = parseInt(el.style.height) || el.offsetHeight / scale
    minL = Math.min(minL, l)
    minT = Math.min(minT, t)
    maxR = Math.max(maxR, l + w)
    maxB = Math.max(maxB, t + h)
  }
  // Create group container
  const group = document.createElement('div')
  group.setAttribute('data-group', 'true')
  group.style.cssText = `position:absolute;left:${minL}px;top:${minT}px;width:${maxR-minL}px;height:${maxB-minT}px;`
  // Move elements into group, adjust positions relative to group
  for (const el of selectedEls.value) {
    const l = parseInt(el.style.left) || 0
    const t = parseInt(el.style.top) || 0
    el.style.left = (l - minL) + 'px'
    el.style.top = (t - minT) + 'px'
    group.appendChild(el)
  }
  slideRef.value.appendChild(group)
  pushHistory(); saveHtml()
  selectElement(group)
}

function ungroupSelected() {
  if (selectedEls.value.length !== 1) return
  const group = selectedEls.value[0]
  if (!group.hasAttribute('data-group')) return
  const gl = parseInt(group.style.left) || 0
  const gt = parseInt(group.style.top) || 0
  // Move children back to slide with absolute positions
  const children = Array.from(group.children)
  for (const child of children) {
    const cl = parseInt(child.style.left) || 0
    const ct = parseInt(child.style.top) || 0
    child.style.left = (cl + gl) + 'px'
    child.style.top = (ct + gt) + 'px'
    slideRef.value.appendChild(child)
  }
  group.remove()
  pushHistory(); saveHtml()
  deselectAll()
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
  const scale = sr.width / 960
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
  const scale = slideRef.value.getBoundingClientRect().width / 960
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
    // Rotation handle: above top-center
    rotateHandle.value = { x: x + w/2 - 5, y: y - 30 }
  } else {
    resizeHandles.value = []
    rotateHandle.value = null
  }
}

function onResizeStart(e, dir) {
  if (selectedEls.value.length !== 1) return
  const el = selectedEls.value[0]
  const scale = slideRef.value.getBoundingClientRect().width / 960
  const startX = e.clientX, startY = e.clientY
  const origL = parseInt(el.style.left)||0, origT = parseInt(el.style.top)||0
  const origW = parseInt(el.style.width)||el.offsetWidth/scale
  const origH = parseInt(el.style.height)||el.offsetHeight/scale

  const aspect = origW / origH
  const isCorner = ['nw','ne','sw','se'].includes(dir)

  function onMove(ev) {
    const dx = (ev.clientX - startX) / scale
    const dy = (ev.clientY - startY) / scale
    let nl = origL, nt = origT, nw = origW, nh = origH

    if (isCorner) {
      if (dir === 'se') { nw = Math.max(20, origW + dx); nh = nw / aspect }
      else if (dir === 'ne') { nw = Math.max(20, origW + dx); nh = nw / aspect; nt = origT + (origH - nh) }
      else if (dir === 'sw') { nw = Math.max(20, origW - dx); nh = nw / aspect; nl = origL + (origW - nw) }
      else if (dir === 'nw') { nw = Math.max(20, origW - dx); nh = nw / aspect; nl = origL + (origW - nw); nt = origT + (origH - nh) }
    } else {
      if (dir === 'e') nw = Math.max(20, origW + dx)
      if (dir === 'w') { nw = Math.max(20, origW - dx); nl = origL + dx }
      if (dir === 's') nh = Math.max(20, origH + dy)
      if (dir === 'n') { nh = Math.max(20, origH - dy); nt = origT + dy }
    }

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

function onRotateStart(e) {
  if (selectedEls.value.length !== 1) return
  const el = selectedEls.value[0]
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx)
  const current = parseFloat(el.dataset.rotation) || 0

  function onMove(ev) {
    const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx)
    let deg = current + (angle - startAngle) * 180 / Math.PI
    if (ev.shiftKey) deg = Math.round(deg / 15) * 15
    el.style.transform = `rotate(${deg}deg)`
    el.dataset.rotation = deg
    updateOutlines()
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
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
  if (Math.abs(acx - 480) < SNAP) newGuides.push({ left:'480px', top:'0', width:'1px', height:'540px', background:'#e91e63' })
  if (Math.abs(acy - 270) < SNAP) newGuides.push({ left:'0', top:'270px', width:'960px', height:'1px', background:'#e91e63' })
  // Compare with siblings
  const siblings = Array.from(slideRef.value.children).filter(c => c !== activeEl && c.style.position === 'absolute')
  for (const sib of siblings) {
    const sl = parseInt(sib.style.left)||0, st = parseInt(sib.style.top)||0
    const sw = parseInt(sib.style.width)||sib.offsetWidth, sh = parseInt(sib.style.height)||sib.offsetHeight
    const scx = sl + sw/2, scy = st + sh/2
    // Vertical alignment
    if (Math.abs(ax - sl) < SNAP) newGuides.push({ left:sl+'px', top:'0', width:'1px', height:'540px', background:'#2196f3' })
    if (Math.abs(ar - (sl+sw)) < SNAP) newGuides.push({ left:(sl+sw)+'px', top:'0', width:'1px', height:'540px', background:'#2196f3' })
    if (Math.abs(acx - scx) < SNAP) newGuides.push({ left:scx+'px', top:'0', width:'1px', height:'540px', background:'#2196f3' })
    // Horizontal alignment
    if (Math.abs(ay - st) < SNAP) newGuides.push({ left:'0', top:st+'px', width:'960px', height:'1px', background:'#2196f3' })
    if (Math.abs(ab - (st+sh)) < SNAP) newGuides.push({ left:'0', top:(st+sh)+'px', width:'960px', height:'1px', background:'#2196f3' })
    if (Math.abs(acy - scy) < SNAP) newGuides.push({ left:'0', top:scy+'px', width:'960px', height:'1px', background:'#2196f3' })
  }
  guides.value = newGuides.slice(0, 6) // limit to avoid clutter
}

// --- Marquee (box) selection ---
function startMarquee(e) {
  deselectAll()
  const sr = slideRef.value.getBoundingClientRect()
  const scale = sr.width / 960
  const startX = (e.clientX - sr.left) / scale
  const startY = (e.clientY - sr.top) / scale
  marquee.value = { startX, startY, x: startX, y: startY, w: 0, h: 0 }

  function onMove(ev) {
    const curX = (ev.clientX - sr.left) / scale
    const curY = (ev.clientY - sr.top) / scale
    const x = Math.min(startX, curX)
    const y = Math.min(startY, curY)
    const w = Math.abs(curX - startX)
    const h = Math.abs(curY - startY)
    marquee.value = { startX, startY, x, y, w, h }
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    if (!marquee.value || (marquee.value.w < 5 && marquee.value.h < 5)) {
      marquee.value = null
      return
    }
    // Find elements intersecting the marquee box
    const m = marquee.value
    const children = Array.from(slideRef.value.children)
    for (const child of children) {
      const cl = parseInt(child.style.left) || 0
      const ct = parseInt(child.style.top) || 0
      const cw = parseInt(child.style.width) || child.offsetWidth / scale
      const ch = parseInt(child.style.height) || child.offsetHeight / scale
      // Check intersection
      if (cl < m.x + m.w && cl + cw > m.x && ct < m.y + m.h && ct + ch > m.y) {
        selectedEls.value.push(child)
      }
    }
    marquee.value = null
    updateOutlines()
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function onMouseDown(e) {
  let el = e.target
  console.log('[DEBUG onMouseDown] target:', el.tagName, el.className, 'is slideRef?', el === slideRef.value, 'is rootRef?', el === rootRef.value, 'slideRef.contains?', slideRef.value?.contains(el))
  // If click lands on overlay-layer itself, treat as if clicking slide background
  if (el.classList?.contains('overlay-layer')) { startMarquee(e); return }
  if (el === slideRef.value || el === rootRef.value) {
    // Start marquee selection on blank area
    startMarquee(e)
    return
  }

  // "Deep select": if clicking inside the currently selected element,
  // select the clicked child directly (don't bubble up to top-level absolute)
  // Skip deep-select when shift is held (multi-select mode)
  const SVG_SHAPE_TAGS = ['path','rect','ellipse','circle','polygon','polyline','line']
  const currentSel = selectedEls.value[0]
  if (!e.shiftKey && currentSel && currentSel.contains(el) && el !== currentSel) {
    // For SVG shape elements, select them directly (for color editing)
    let candidate = el
    if (SVG_SHAPE_TAGS.includes(el.tagName.toLowerCase())) {
      candidate = el
    } else {
      while (candidate.parentElement && candidate.parentElement !== currentSel) {
        candidate = candidate.parentElement
      }
    }
    selectElement(candidate)
    emit('select-element', candidate)
    return
  }

  // In full-absolute mode: find the nearest ancestor with position:absolute
  // When inside a group, stop at the group boundary (don't select the group itself)
  const boundary = activeGroup.value || slideRef.value
  while (el && el !== boundary && el !== slideRef.value && el !== rootRef.value) {
    if (el.style.position === 'absolute' || getComputedStyle(el).position === 'absolute') break
    el = el.parentElement
  }
  // If the found element is inside a data-group that we haven't entered, select the group instead
  if (el && el !== boundary && !activeGroup.value) {
    let parent = el.parentElement
    while (parent && parent !== slideRef.value) {
      if (parent.hasAttribute('data-group')) { el = parent; break }
      parent = parent.parentElement
    }
  }
  if (!el || el === slideRef.value || el === rootRef.value || el === boundary) {
    if (activeGroup.value && el === boundary) { deselectAllKeepGroup(); return }
    deselectAll(); return
  }

  // Shift+click or Ctrl+click for multi-select
  if (e.shiftKey || e.ctrlKey) {
    const idx = selectedEls.value.indexOf(el)
    if (idx >= 0) {
      selectedEls.value.splice(idx, 1)
    } else {
      selectedEls.value.push(el)
    }
    updateOutlines()
    emit('select-element', el)
    return  // Don't start drag on shift/ctrl+click
  } else {
    // Always re-select (even if same element) to exit deep-select state
    selectElement(el)
  }

  // Drag
  const scale = slideRef.value.getBoundingClientRect().width / 960
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

  // Double-click on a group (or inside a selected group) → enter group editing mode
  const selEl = selectedEls.value[0]
  if (selEl && selEl.hasAttribute('data-group') && !activeGroup.value) {
    enterGroup(selEl)
    return
  }

  // LaTeX block: double-click to edit formula
  const latexEl = el.closest('.latex-block')
  if (latexEl) {
    const oldLatex = latexEl.getAttribute('data-latex') || ''
    const newLatex = prompt('编辑 LaTeX 公式：', oldLatex)
    if (newLatex !== null && newLatex !== oldLatex) {
      try {
        latexEl.innerHTML = window.katex.renderToString(newLatex, { throwOnError: false, displayMode: true })
        latexEl.setAttribute('data-latex', newLatex)
      } catch (err) {
        latexEl.innerHTML = `<span style="color:red;">公式错误: ${err.message}</span>`
      }
      pushHistory()
      saveHtml()
    }
    return
  }
  
  // If element has no text content, skip
  if (!el.textContent.trim()) return
  
  // If element contains block-level children (div, section, ul, etc.), skip
  const blockTags = ['DIV', 'SECTION', 'UL', 'OL', 'TABLE', 'NAV', 'HEADER', 'FOOTER', 'ARTICLE']
  const hasBlockChildren = Array.from(el.children).some(c => blockTags.includes(c.tagName))
  if (hasBlockChildren) return
  
  // Safe to edit: text element (may contain inline spans)
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

defineExpose({ insertHtml, undo, redo })
</script>

<style scoped>
.html-canvas-root { position: relative; width: 960px; height: 540px; }
.slide-render { width: 100%; height: 100%; position: relative; overflow: hidden; background: #fff; }
.overlay-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
.overlay-layer .resize-handle, .overlay-layer .rotate-handle { pointer-events: auto; }
.selection-outline {
  position: absolute; pointer-events: none;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-sm);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.2);
  transition: box-shadow 0.15s ease;
}
.resize-handle {
  position: absolute; width: 10px; height: 10px;
  background: var(--color-surface); border: 2px solid var(--color-primary);
  border-radius: 3px; z-index: 100;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.resize-handle:hover {
  transform: scale(1.3);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}
.rotate-handle {
  position: absolute; width: 12px; height: 12px;
  background: var(--color-surface); border: 2px solid var(--color-primary);
  border-radius: 50%; z-index: 100; cursor: grab;
}
.rotate-handle:hover { background: var(--color-primary); }
.rh-nw { cursor: nw-resize; }
.rh-n { cursor: n-resize; }
.rh-ne { cursor: ne-resize; }
.rh-e { cursor: e-resize; }
.rh-se { cursor: se-resize; }
.rh-s { cursor: s-resize; }
.rh-sw { cursor: sw-resize; }
.rh-w { cursor: w-resize; }
.align-guide {
  position: absolute; pointer-events: none; z-index: 99;
  opacity: 0.8; background: #ef4444;
}
.marquee-box {
  position: absolute; pointer-events: none; z-index: 98;
  border: 1.5px dashed var(--color-primary);
  background: rgba(37, 99, 235, 0.05);
  border-radius: 2px;
}
</style>
