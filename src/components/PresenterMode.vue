<template>
  <div class="fullscreen-presenter" @keydown="onKey" tabindex="0" ref="overlay">
    <div class="slide-container">
      <div class="slide-canvas" :style="canvasStyle" v-html="currentSlideHtml"></div>
    </div>
    <div class="slide-counter">{{ currentIdx + 1 }} / {{ slides.length }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({ slides: Array, startIndex: { type: Number, default: 0 } })
const emit = defineEmits(['exit'])

const currentIdx = ref(props.startIndex)
const currentSlideHtml = computed(() => props.slides[currentIdx.value]?.innerHTML || '')

const windowW = ref(window.innerWidth)
const windowH = ref(window.innerHeight)

const canvasStyle = computed(() => {
  const scale = Math.min(windowW.value / 960, windowH.value / 540)
  return {
    width: '960px',
    height: '540px',
    transform: `scale(${scale})`,
    transformOrigin: 'center center'
  }
})

function onResize() { windowW.value = window.innerWidth; windowH.value = window.innerHeight }

function onKey(e) {
  if (e.key === 'Escape') { emit('exit'); return }
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    if (currentIdx.value < props.slides.length - 1) currentIdx.value++
  } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
    e.preventDefault()
    if (currentIdx.value > 0) currentIdx.value--
  }
}

function onFullscreenChange() {
  if (!document.fullscreenElement) emit('exit')
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  document.addEventListener('keydown', onKey)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<style scoped>
.fullscreen-presenter {
  position: fixed; inset: 0; z-index: 99999;
  background: #000;
  display: flex; align-items: center; justify-content: center;
  cursor: none;
}
.fullscreen-presenter:hover { cursor: default; }
.slide-container {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%;
}
.slide-canvas {
  position: relative;
  background: #fff;
  overflow: hidden;
}
.slide-counter {
  position: fixed; bottom: 16px; right: 24px;
  color: rgba(255,255,255,0.4); font-size: 14px;
  pointer-events: none;
}
</style>
