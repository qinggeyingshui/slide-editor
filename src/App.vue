<template>
  <!-- Presenter Mode: pure DOM overlay (bypasses Vue HMR issues) -->
  <div v-if="presenterMode" class="fullscreen-presenter" ref="presenterRef" tabindex="0" @keydown="onPresenterKey">
    <div class="slide-container">
      <div class="slide-canvas" ref="presenterCanvas"></div>
    </div>
    <div class="slide-counter">{{ presenterIdx + 1 }} / {{ slides.length }}</div>
  </div>
  <!-- Editor View (direct mode) -->
  <div class="editor" v-show="!presenterMode">
    <div class="toolbar">
      <div class="toolbar-left">
        <span class="app-title">Slide Editor</span>
      </div>
      <div class="toolbar-center">
        <div class="shape-dropdown-wrap">
          <button @click="showShapeMenu = !showShapeMenu">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="12" height="12" rx="2"/></svg>
            形状
          </button>
          <div v-if="showShapeMenu" class="shape-dropdown">
            <button @click="insertShape('rect')">矩形</button>
            <button @click="insertShape('ellipse')">椭圆</button>
            <button @click="insertShape('triangle')">三角</button>
            <button @click="insertShape('line')">线条</button>
            <button @click="insertShape('arrow')">箭头</button>
          </div>
        </div>
        <label class="tb-upload-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="2.5" width="13" height="11" rx="2"/><circle cx="5.5" cy="6.5" r="1.5"/><path d="M1.5 11.5l3.5-3.5 2.5 2.5 3-3.5 4 4.5"/></svg>
          图片
          <input type="file" accept="image/*" hidden @change="handleImageUpload" />
        </label>
        <button @click="insertTextBox">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h10M8 4v9M5.5 13h5"/></svg>
          文本
        </button>
        <button @click="insertLatex">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12l3-8h1l3 8M3.5 8.5h4M11 4v8M13 4l-2 4 2 4"/></svg>
          公式
        </button>
        <label class="tb-upload-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="6,3 13,8 6,13"/><line x1="3" y1="3" x2="3" y2="13"/></svg>
          视频
          <input type="file" accept="video/*" hidden @change="handleVideoUpload" />
        </label>
        <span class="tb-sep"></span>
        <button @click="saveToFile" title="Ctrl+S">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12.5 14.5h-9a1 1 0 01-1-1v-11a1 1 0 011-1h7l3 3v9a1 1 0 01-1 1z"/><path d="M5.5 14.5v-4h5v4"/><path d="M5.5 1.5v3h4"/></svg>
          保存
        </button>
        <div class="export-dropdown" style="position:relative;display:inline-block;">
          <button @click="showExportMenu=!showExportMenu">导出 ▾</button>
          <div v-if="showExportMenu" class="export-menu" style="position:absolute;top:100%;left:0;background:#fff;border:1px solid #e0e0e0;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.1);padding:4px;z-index:100;white-space:nowrap;">
            <button @click="exportJSON();showExportMenu=false" style="display:block;width:100%;text-align:left;border:none;padding:6px 12px;">导出 JSON</button>
            <button @click="exportPPTX();showExportMenu=false" style="display:block;width:100%;text-align:left;border:none;padding:6px 12px;">导出 PPTX</button>
          </div>
        </div>
        <div class="export-dropdown" style="position:relative;display:inline-block;">
          <button @click="showImportMenu=!showImportMenu">导入 ▾</button>
          <div v-if="showImportMenu" class="export-menu" style="position:absolute;top:100%;left:0;background:#fff;border:1px solid #e0e0e0;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.1);padding:4px;z-index:100;white-space:nowrap;">
            <label style="display:block;padding:6px 12px;cursor:pointer;">导入 JSON<input type="file" accept=".json" hidden @change="(e)=>{importJSON(e);showImportMenu=false}" /></label>
            <label style="display:block;padding:6px 12px;cursor:pointer;">导入 PPTX<input type="file" accept=".pptx" hidden @change="(e)=>{importPPTX(e);showImportMenu=false}" /></label>
          </div>
        </div>
        <span v-if="saveStatus" class="save-status">{{ saveStatus }}</span>
      </div>
      <div class="toolbar-right">
        <button class="present-btn" @click="startPresentation" title="演示模式 (F5)">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5,3 13,8 5,13"/></svg>
          演示
        </button>
        <span class="page-info">{{ currentIndex + 1 }} / {{ slides.length }}</span>
      </div>
    </div>
    <div class="main-area">
      <div class="slide-list">
        <div v-for="(s, i) in slides" :key="s.id"
          class="slide-thumb" :class="{active: i === currentIndex}"
          @click="currentIndex = i">
          <div class="thumb-num">{{ i + 1 }}</div>
          <div class="thumb-preview">
            <div class="thumb-content" v-html="s.innerHTML"></div>
          </div>
        </div>
      </div>
      <FloatingToolbar :elStyles="selectedElStyles"
        @apply-style="onApplyStyle"
        @clone-before="onCloneBefore"
        @clone-after="onCloneAfter"
        @delete-el="onDeleteEl"
        @ungroup="onUngroup"
        @layer-up="onLayerUp"
        @layer-down="onLayerDown" />
      <div class="canvas-wrap" ref="canvasWrapRef">
        <div class="canvas" :style="canvasTransform">
          <div class="canvas-inner" :style="innerTransform">
            <HtmlCanvas ref="htmlCanvasRef"
              :slide="currentSlide"
              @select-element="onSelectElement"
              @update-html="onUpdateHtml" />
            <ShapeLayer
              :shapes="currentShapes"
              :selectedShape="selectedShapeId"
              @shapedrag="onShapeDrag"
              @shaperesize="onShapeResize"
              @shapemove="onShapeMove"
              @shapeup="onShapeUp"
              @clearselection="selectedShapeId = null" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import HtmlCanvas from './components/HtmlCanvas.vue'
import ShapeLayer from './components/ShapeLayer.vue'
import FloatingToolbar from './components/FloatingToolbar.vue'
import * as echarts from 'echarts'
import { slides as presentationSlides } from './model/presentationData.js'
import { createShape } from './model/types.js'
import { useFileIO } from './composables/useFileIO.js'
import { useCanvasScale } from './composables/useCanvasScale.js'
import { useElementStyle } from './composables/useElementStyle.js'
import { useInsert } from './composables/useInsert.js'

// Slides data
function loadSlides() { return presentationSlides.map(s => ({ ...s })) }
const slides = ref(loadSlides())
const currentIndex = ref(0)
const currentSlide = computed(() => slides.value[currentIndex.value])

// Presenter mode
const presenterMode = ref(false)
const presenterIdx = ref(0)
const presenterCanvas = ref(null)
const presenterRef = ref(null)

function renderPresenterSlide() {
  const canvas = document.querySelector('.fullscreen-presenter .slide-canvas')
  if (!canvas || !slides.value.length) return
  const html = slides.value[presenterIdx.value]?.innerHTML || ''
  canvas.innerHTML = html
  nextTick(() => {
    canvas.querySelectorAll('[data-echarts]').forEach(el => {
      try {
        const opt = JSON.parse(el.getAttribute('data-echarts'))
        echarts.init(el, null, { renderer: 'svg' }).setOption(opt)
      } catch(e) {}
    })
  })
}

function startPresentation() {
  presenterIdx.value = currentIndex.value
  presenterMode.value = true
  nextTick(() => {
    renderPresenterSlide()
    const el = presenterRef.value || document.querySelector('.fullscreen-presenter')
    if (el) {
      const s = Math.min(window.innerWidth / 960, window.innerHeight / 540)
      el.querySelector('.slide-canvas').style.transform = `scale(${s})`
      el.focus()
      el.requestFullscreen?.().catch(() => {})
    }
  })
}
function exitPresentation() {
  if (document.fullscreenElement) document.exitFullscreen?.()
  presenterMode.value = false
}

watch(presenterIdx, renderPresenterSlide)
watch(presenterMode, (v) => { if (v) nextTick(renderPresenterSlide) })

function onPresenterKey(e) {
  if (!presenterMode.value) return
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); presenterIdx.value = Math.min(presenterIdx.value + 1, slides.value.length - 1) }
  else if (e.key === 'ArrowLeft') { presenterIdx.value = Math.max(presenterIdx.value - 1, 0) }
  else if (e.key === 'Escape') { exitPresentation() }
}
onMounted(() => document.addEventListener('keydown', onPresenterKey))
onUnmounted(() => document.removeEventListener('keydown', onPresenterKey))

// Composables
const { saveStatus, saveToFile, exportJSON, importJSON, exportPPTX, importPPTX } = useFileIO(slides, currentIndex)

const canvasWrapRef = ref(null)
const htmlCanvasRef = ref(null)
const { canvasScale, updateScale, canvasTransform, innerTransform } = useCanvasScale(canvasWrapRef)

function getCanvasApi() {
  const root = document.querySelector('.html-canvas-root')
  if (root?.__api) return root.__api
  const slideRender = document.querySelector('.slide-render')
  if (slideRender) {
    return {
      insertHtml(html) {
        slideRender.insertAdjacentHTML('beforeend', html)
        if (currentSlide.value) currentSlide.value.innerHTML = slideRender.innerHTML
      },
      pushHistory() {}, undo() {}, redo() {}
    }
  }
  return null
}

const { selectedElStyles, getSelectedDomEl, onSelectElement, onApplyStyle, onCloneBefore, onCloneAfter, onDeleteEl, syncDomToSlides } = useElementStyle(currentSlide, getCanvasApi)
const { insertTextBox, insertLatex, handleImageUpload, handleVideoUpload } = useInsert(getCanvasApi)

function onUngroup() {
  const el = getSelectedDomEl()
  if (!el || !el.children.length) return
  const slideRender = el.parentElement
  if (!slideRender) return
  const s = canvasScale.value
  const renderRect = slideRender.getBoundingClientRect()
  const children = Array.from(el.children)
  const rects = children.map(child => child.getBoundingClientRect())
  children.forEach((child, i) => {
    child.style.position = 'absolute'
    child.style.left = ((rects[i].left - renderRect.left) / s) + 'px'
    child.style.top = ((rects[i].top - renderRect.top) / s) + 'px'
    child.style.width = (rects[i].width / s) + 'px'
    slideRender.insertBefore(child, el)
  })
  el.innerHTML = ''
  syncDomToSlides()
}

function onLayerUp() {
  const el = getSelectedDomEl()
  if (!el || !el.nextElementSibling) return
  el.parentElement.insertBefore(el.nextElementSibling, el)
  syncDomToSlides()
}

function onLayerDown() {
  const el = getSelectedDomEl()
  if (!el || !el.previousElementSibling) return
  el.parentElement.insertBefore(el, el.previousElementSibling)
  syncDomToSlides()
}

function onUpdateHtml(html) {
  if (currentSlide.value) {
    currentSlide.value.innerHTML = html
    if (currentSlide.value.blocks?.[0]) currentSlide.value.blocks[0].content = html
  }
}

// Slide operations
function addSlide() {
  const newSlide = { id: 'slide_' + Date.now(), slideStyle: '', blocks: [{ id: 'b_' + Date.now(), type: 'rawHtml', content: '<h2>新页面</h2><p>点击编辑内容</p>' }] }
  slides.value.splice(currentIndex.value + 1, 0, newSlide)
  currentIndex.value++
}
function deleteSlide() {
  if (slides.value.length <= 1) return
  slides.value.splice(currentIndex.value, 1)
  if (currentIndex.value >= slides.value.length) currentIndex.value--
}
function duplicateSlide() {
  const copy = JSON.parse(JSON.stringify(currentSlide.value))
  copy.id = 'slide_' + Date.now()
  slides.value.splice(currentIndex.value + 1, 0, copy)
  currentIndex.value++
}

// Shapes
const showShapeMenu = ref(false)
const showExportMenu = ref(false)
const showImportMenu = ref(false)
const selectedShapeId = ref(null)
const shapeDrag = ref(null)
const shapeResize = ref(null)
const currentShapes = computed(() => currentSlide.value?.shapes || [])

function insertShape(type) {
  if (!currentSlide.value.shapes) currentSlide.value.shapes = []
  currentSlide.value.shapes.push(createShape(type, 100 + Math.random()*200, 100 + Math.random()*200))
  showShapeMenu.value = false
}
function onShapeDrag(e, shape) {
  selectedShapeId.value = shape.id
  shapeDrag.value = { shape, startX: e.clientX - shape.x, startY: e.clientY - shape.y }
}
function onShapeResize(e, shape) {
  shapeResize.value = { shape, startX: e.clientX, startY: e.clientY, startW: shape.w, startH: shape.h }
}
function onShapeMove(e) {
  if (shapeDrag.value) {
    const { shape, startX, startY } = shapeDrag.value
    shape.x = Math.round(e.clientX - startX); shape.y = Math.round(e.clientY - startY)
  }
  if (shapeResize.value) {
    const { shape, startX, startY, startW, startH } = shapeResize.value
    shape.w = Math.max(20, startW + (e.clientX - startX)); shape.h = Math.max(20, startH + (e.clientY - startY))
  }
}
function onShapeUp() { shapeDrag.value = null; shapeResize.value = null }

function unlockFreeLayout() {
  const api = getCanvasApi()
  if (api?.unlockFreeLayout) { api.unlockFreeLayout(); return }
  const render = document.querySelector('.slide-render')
  if (!render) return
  const sg = render.querySelector('.sg')
  const container = sg || render
  if (sg) sg.style.position = 'relative'
  ;[...container.children].forEach(el => {
    if (el.tagName === 'STYLE') return
    el.style.position = 'absolute'
    if (!el.style.left) el.style.left = el.offsetLeft + 'px'
    if (!el.style.top) el.style.top = el.offsetTop + 'px'
  })
}

function thumbStyle(s) { return s.slideStyle || 'background: #f0f4f8;' }

// Keyboard shortcuts
function onKeyDown(e) {
  if (e.target.isContentEditable) return
  if (e.key === 'F5') { e.preventDefault(); startPresentation(); return }
  if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveToFile(); return }
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); addSlide(); return }
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); duplicateSlide(); return }
  if ((e.key === 'Delete' || e.key === 'Backspace') && !getSelectedDomEl() && slides.value.length > 1) { e.preventDefault(); deleteSlide() }
}

// Lifecycle
let ro = null
onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  ro = new ResizeObserver(updateScale)
  nextTick(() => { if (canvasWrapRef.value) { ro.observe(canvasWrapRef.value); updateScale() } })
})
watch(canvasWrapRef, (el) => { if (el) { if (ro) ro.observe(el); updateScale() } })
onUnmounted(() => { if (ro) ro.disconnect(); document.removeEventListener('keydown', onKeyDown) })
</script>

<style>
/* === Design System Tokens === */
:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-light: #eff6ff;
  --color-surface: #ffffff;
  --color-surface-alt: #f8fafc;
  --color-border: #e2e8f0;
  --color-border-hover: #cbd5e1;
  --color-text-primary: #1e293b;
  --color-text-secondary: #64748b;
  --color-text-muted: #94a3b8;
  --color-danger: #ef4444;
  --color-danger-light: #fef2f2;
  --color-success: #10b981;
  --color-canvas-bg: #f1f5f9;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);
  --shadow-float: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06);
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif;
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { height: 100%; }

.editor {
  height: 100vh; display: flex; flex-direction: column;
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background: var(--color-canvas-bg);
}

/* === Toolbar === */
.toolbar {
  height: 72px; background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex; align-items: center; padding: 0 32px;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  position: relative; z-index: 10;
}
.toolbar-left .app-title {
  font-size: 18px; font-weight: 700; color: var(--color-text-primary);
  letter-spacing: -0.3px;
}
.toolbar-center { display: flex; gap: 10px; align-items: center; }
.toolbar-center button {
  padding: 10px 18px; border: 1.5px solid #dadce0;
  border-radius: 10px; background: #fff;
  cursor: pointer; font-size: 15px; font-weight: 500;
  color: #0d1216; height: 42px;
  display: inline-flex; align-items: center; gap: 8px;
  transition: all var(--transition-fast);
  letter-spacing: 0;
}
.toolbar-center button:hover {
  background: #f0f0f0;
  border-color: #0d1216;
  color: #0d1216;
}
.toolbar-center button:active { background: #e4e4e4; }
.toolbar-center button:disabled {
  opacity: 0.35; cursor: not-allowed;
}
.tb-sep { width: 1.5px; height: 24px; background: #e8e8e8; margin: 0 4px; }
.shape-dropdown-wrap { position: relative; }
.shape-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0;
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg); padding: 6px;
  z-index: 100; display: flex; flex-direction: column; gap: 2px;
  min-width: 120px; animation: dropIn 0.15s ease-out;
}
@keyframes dropIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.shape-dropdown button {
  text-align: left; border: none; padding: 8px 12px;
  border-radius: var(--radius-sm); cursor: pointer;
  font-size: 13px; color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}
.shape-dropdown button:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}
.tb-upload-btn {
  padding: 8px 16px; border: 1.5px solid #dadce0;
  border-radius: 8px; background: #fff;
  cursor: pointer; font-size: 14px; font-weight: 500;
  color: #0d1216; height: 36px;
  display: inline-flex; align-items: center; gap: 6px;
  transition: all var(--transition-fast);
}
.tb-upload-btn:hover {
  background: #f0f0f0;
  border-color: #0d1216;
  color: #0d1216;
}
.toolbar-right { display: flex; gap: 10px; align-items: center; }
.toolbar-right button {
  padding: 10px 18px; border: 1.5px solid #dadce0;
  border-radius: 10px; background: #fff;
  cursor: pointer; font-size: 15px; font-weight: 500;
  color: #0d1216; height: 42px;
  display: inline-flex; align-items: center; gap: 8px;
  transition: all var(--transition-fast);
}
.toolbar-right button:hover {
  background: #f0f0f0;
  border-color: #0d1216;
  color: #0d1216;
}
.toolbar-right .page-info {
  font-size: 13px; color: var(--color-text-muted);
  font-weight: 500; font-variant-numeric: tabular-nums;
}

/* === Main Layout === */
.main-area { flex: 1; display: flex; overflow: hidden; }

/* === Slide List === */
.slide-list {
  width: 190px; background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  overflow-y: auto; padding: 14px;
}
.slide-list::-webkit-scrollbar { width: 4px; }
.slide-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
.slide-thumb {
  margin-bottom: 12px; cursor: pointer;
  border-radius: var(--radius-md);
  border: 2px solid transparent; padding: 6px;
  transition: all var(--transition-fast);
}
.slide-thumb:hover { background: var(--color-surface-alt); border-color: var(--color-border-hover); }
.slide-thumb.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.thumb-num {
  font-size: 11px; color: var(--color-text-muted);
  font-weight: 600; margin-bottom: 6px;
}
.thumb-preview {
  width: 100%; aspect-ratio: 16/9;
  border-radius: var(--radius-sm);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  overflow: hidden; position: relative;
  transition: box-shadow var(--transition-fast);
}
.slide-thumb:hover .thumb-preview { box-shadow: var(--shadow-sm); }
.thumb-content {
  position: absolute; top: 0; left: 0;
  width: 960px; height: 540px;
  transform: scale(0.183); transform-origin: top left;
  pointer-events: none;
}

/* === Canvas === */
.canvas-wrap {
  flex: 1; display: flex; align-items: center; justify-content: center;
  background: var(--color-canvas-bg); overflow: hidden;
  padding: 0; position: relative;
}
.canvas {
  box-shadow: var(--shadow-float);
  overflow: hidden; border-radius: var(--radius-sm);
}
.canvas-inner { position: relative; }

/* === Save Status === */
.save-status {
  font-size: 12px; color: var(--color-success);
  font-weight: 500; margin-left: 10px;
  animation: fadeSlideIn 0.25s ease-out;
}
@keyframes fadeSlideIn { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }

/* === Presenter Mode === */
.fullscreen-presenter {
  position: fixed; inset: 0; z-index: 99999;
  background: #000; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  width: 100%; height: 100%;
  outline: none;
}
.fullscreen-presenter:fullscreen {
  width: 100vw; height: 100vh;
}
.fullscreen-presenter .slide-container {
  width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
}
.fullscreen-presenter .slide-canvas {
  width: 960px; height: 540px;
  background: #fff; border-radius: 0;
  transform-origin: center center;
  overflow: hidden; padding: 40px;
  box-sizing: border-box;
}
.fullscreen-presenter .slide-counter {
  position: absolute; bottom: 20px; right: 30px;
  color: rgba(255,255,255,0.7); font-size: 14px;
}
</style>
