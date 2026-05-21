<template>
  <!-- Editor View (direct mode) -->
  <div class="editor">
    <div class="toolbar">
      <div class="toolbar-left">
        <span class="app-title">Slide Editor</span>
      </div>
      <div class="toolbar-center">
        <button @click="addSlide">+ 新页</button>
        <button @click="deleteSlide" :disabled="slides.length<=1">删除页</button>
        <button @click="duplicateSlide">复制页</button>
        <span class="tb-sep"></span>
        <div class="shape-dropdown-wrap">
          <button @click="showShapeMenu = !showShapeMenu">形状 ▾</button>
          <div v-if="showShapeMenu" class="shape-dropdown">
            <button @click="insertShape('rect')">矩形</button>
            <button @click="insertShape('ellipse')">椭圆</button>
            <button @click="insertShape('triangle')">三角</button>
            <button @click="insertShape('line')">线条</button>
            <button @click="insertShape('arrow')">箭头</button>
          </div>
        </div>
        <label class="tb-upload-btn">
          📷 图片
          <input type="file" accept="image/*" hidden @change="handleImageUpload" />
        </label>
        <span class="tb-sep"></span>
        <button @click="unlockFreeLayout" title="将所有元素转为自由定位，可随意拖拽">🔓 自由布局</button>
      </div>
      <div class="toolbar-right">
        <span class="page-info">{{ currentIndex + 1 }} / {{ slides.length }}</span>
      </div>
    </div>
    <div class="main-area">
      <div class="slide-list">
        <div v-for="(s, i) in slides" :key="s.id"
          class="slide-thumb" :class="{active: i === currentIndex}"
          @click="currentIndex = i">
          <div class="thumb-num">{{ i + 1 }}</div>
          <div class="thumb-preview" :style="thumbStyle(s)"></div>
        </div>
      </div>
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
      <div class="props-panel">
        <StylePanel :elStyles="selectedElStyles" @apply-style="onApplyStyle" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import HtmlCanvas from './components/HtmlCanvas.vue'
import ShapeLayer from './components/ShapeLayer.vue'
import StylePanel from './components/StylePanel.vue'
import { presentationSlides, presentationCSS } from './model/presentationData.js'
import { createShape } from './model/types.js'

const STORAGE_KEY = 'slide-editor-data'

// Inject presentation CSS
const styleEl = document.createElement('style')
styleEl.textContent = presentationCSS
document.head.appendChild(styleEl)

// Load slides: localStorage first, fallback to presentationData
function loadSlides() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) { /* ignore parse errors */ }
  return presentationSlides.map(s => ({ ...s }))
}

function saveSlides() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides.value))
  } catch (e) { /* quota exceeded etc */ }
}

// Slides data
const slides = ref(loadSlides())
const currentIndex = ref(0)
const currentSlide = computed(() => slides.value[currentIndex.value])

// Canvas scaling
const canvasWrapRef = ref(null)
const htmlCanvasRef = ref(null)
const canvasScale = ref(1)

function updateScale() {
  if (!canvasWrapRef.value) return
  const w = canvasWrapRef.value.clientWidth - 48
  const h = canvasWrapRef.value.clientHeight - 32
  canvasScale.value = Math.min(w / 1280, h / 720)
}

const canvasTransform = computed(() => {
  const s = canvasScale.value
  return {
    width: (1280 * s) + 'px',
    height: (720 * s) + 'px'
  }
})

const innerTransform = computed(() => ({
  transform: `scale(${canvasScale.value})`,
  transformOrigin: 'top left',
  width: '1280px',
  height: '720px'
}))

let ro = null
onMounted(() => {
  updateScale()
  ro = new ResizeObserver(updateScale)
  if (canvasWrapRef.value) ro.observe(canvasWrapRef.value)
  // Double-click on group elements → enter group
  document.addEventListener('dblclick', (e) => {
    const api = getCanvasApi()
    if (!api || !api.enterGroup) return
    // Find closest group element (.g2 or similar)
    const groupEl = e.target.closest('.g2, .g3, .g4, [class*="group"]')
    if (groupEl) {
      api.enterGroup(groupEl)
    }
  })
})
onUnmounted(() => { if (ro) ro.disconnect() })

// Auto-save to localStorage on any slide change
watch(slides, saveSlides, { deep: true })

// Element selection
const selectedElStyles = ref(null)
function onSelectElement(styles) { selectedElStyles.value = styles }
function getCanvasApi() {
  const root = document.querySelector('.html-canvas-root')
  return root && root.__api
}
function onApplyStyle(prop, value) {
  const api = getCanvasApi()
  if (api && api.applyStyle) api.applyStyle(prop, value)
}
function onUpdateHtml(html) {
  if (currentSlide.value) {
    currentSlide.value.innerHTML = html
    if (currentSlide.value.blocks && currentSlide.value.blocks[0]) {
      currentSlide.value.blocks[0].content = html
    }
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
    shape.x = Math.round(e.clientX - startX)
    shape.y = Math.round(e.clientY - startY)
  }
  if (shapeResize.value) {
    const { shape, startX, startY, startW, startH } = shapeResize.value
    shape.w = Math.max(20, startW + (e.clientX - startX))
    shape.h = Math.max(20, startH + (e.clientY - startY))
  }
}
function onShapeUp() {
  shapeDrag.value = null
  shapeResize.value = null
}

// Image upload - free positioning
function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    const img = `<img src="${ev.target.result}" style="position:absolute;left:100px;top:100px;width:300px;cursor:move;z-index:10;user-select:none;" class="free-img" />`
    const api = getCanvasApi()
    if (api && api.insertHtml) {
      api.insertHtml(img)
    }
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function unlockFreeLayout() {
  const api = getCanvasApi()
  if (api && api.unlockFreeLayout) {
    api.unlockFreeLayout()
    return
  }
  // DOM fallback
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

function thumbStyle(s) {
  return s.slideStyle || 'background: #f0f4f8;'
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { height: 100%; }
.editor { height: 100vh; display: flex; flex-direction: column; font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif; }
.toolbar { height: 60px; background: #fff; border-bottom: 1px solid #e8e8e8; display: flex; align-items: center; padding: 0 20px; justify-content: space-between; }
.toolbar-left .app-title { font-size: 16px; font-weight: 600; color: #333; }
.toolbar-left .back-btn { padding: 4px 10px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; margin-right: 12px; }
.toolbar-left .back-btn:hover { background: #f0f0f0; }
.toolbar-center { display: flex; gap: 8px; align-items: center; }
.toolbar-center button { padding: 6px 14px; border: 1px solid #ddd; border-radius: 6px; background: #fff; cursor: pointer; font-size: 13px; }
.toolbar-center button:hover { background: #f5f5f5; }
.toolbar-center button:disabled { opacity: 0.4; cursor: not-allowed; }
.tb-sep { width: 1px; height: 24px; background: #e0e0e0; margin: 0 4px; }
.shape-dropdown-wrap { position: relative; }
.shape-dropdown { position: absolute; top: 100%; left: 0; background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,.1); padding: 4px; z-index: 100; display: flex; flex-direction: column; gap: 2px; min-width: 100px; }
.shape-dropdown button { text-align: left; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; }
.shape-dropdown button:hover { background: #f0f4ff; }
.tb-upload-btn { padding: 6px 14px; border: 1px solid #ddd; border-radius: 6px; background: #fff; cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 4px; }
.tb-upload-btn:hover { background: #f5f5f5; }
.toolbar-right .page-info { font-size: 13px; color: #666; }
.main-area { flex: 1; display: flex; overflow: hidden; }
.slide-list { width: 200px; background: #fafafa; border-right: 1px solid #e8e8e8; overflow-y: auto; padding: 12px; }
.slide-thumb { margin-bottom: 10px; cursor: pointer; border-radius: 6px; border: 2px solid transparent; padding: 4px; }
.slide-thumb.active { border-color: #1a73e8; background: #e8f0fe; }
.thumb-num { font-size: 11px; color: #666; margin-bottom: 4px; }
.thumb-preview { width: 100%; aspect-ratio: 16/9; border-radius: 4px; background: #f0f4f8; border: 1px solid #eee; }
.canvas-wrap { flex: 1; display: flex; align-items: center; justify-content: center; background: #e8eaed; overflow: hidden; padding: 0; }
.canvas { box-shadow: 0 2px 12px rgba(0,0,0,0.15); overflow: hidden; border-radius: 4px; }
.canvas-inner { position: relative; }
.props-panel { width: 320px; background: #fff; border-left: 1px solid #e8e8e8; overflow-y: auto; }
</style>
