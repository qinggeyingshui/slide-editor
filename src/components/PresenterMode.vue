<template>
  <div class="presenter-overlay" @keydown="onKey" tabindex="0" ref="overlay">
    <!-- Main slide display -->
    <div class="presenter-main">
      <div class="slide-display" v-html="currentSlideHtml"></div>
      <div class="slide-counter">{{ currentIdx + 1 }} / {{ slides.length }}</div>
    </div>
    <!-- Speaker panel (right side) -->
    <div class="speaker-panel">
      <div class="next-preview">
        <h4>下一页</h4>
        <div class="next-slide-mini" v-html="nextSlideHtml"></div>
      </div>
      <div class="speaker-notes">
        <h4>演讲者备注</h4>
        <textarea v-model="notes[currentIdx]" placeholder="在此输入备注..."></textarea>
      </div>
      <div class="timer">
        <span>{{ formattedTime }}</span>
        <button @click="resetTimer">重置</button>
      </div>
      <button class="exit-btn" @click="$emit('exit')">退出 (Esc)</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  slides: { type: Array, required: true },
  startIndex: { type: Number, default: 0 }
})
const emit = defineEmits(['exit'])

const overlay = ref(null)
const currentIdx = ref(props.startIndex)
const notes = ref(props.slides.map(() => ''))
const elapsed = ref(0)
let timer = null

const currentSlideHtml = computed(() => {
  const s = props.slides[currentIdx.value]
  return s ? s.innerHTML || '' : ''
})
const nextSlideHtml = computed(() => {
  const s = props.slides[currentIdx.value + 1]
  return s ? s.innerHTML || '' : ''
})

const formattedTime = computed(() => {
  const m = Math.floor(elapsed.value / 60)
  const s = elapsed.value % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
})

function resetTimer() { elapsed.value = 0 }

function onKey(e) {
  if (e.key === 'Escape') { emit('exit'); return }
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
    if (currentIdx.value < props.slides.length - 1) currentIdx.value++
  }
  if (e.key === 'ArrowLeft') {
    if (currentIdx.value > 0) currentIdx.value--
  }
}

onMounted(() => {
  nextTick(() => overlay.value?.focus())
  timer = setInterval(() => elapsed.value++, 1000)
  document.documentElement.requestFullscreen?.()
})
onUnmounted(() => {
  clearInterval(timer)
  if (document.fullscreenElement) document.exitFullscreen?.()
})
</script>

<style scoped>
.presenter-overlay {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; background: #1a1a2e; outline: none;
}
.presenter-main {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 20px;
}
.slide-display {
  width: 960px; height: 540px; background: #fff;
  border-radius: 8px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  transform-origin: top left; padding: 40px;
}
.slide-counter {
  color: #aaa; margin-top: 16px; font-size: 14px;
}
.speaker-panel {
  width: 320px; background: #16213e; padding: 20px;
  display: flex; flex-direction: column; gap: 16px; overflow-y: auto;
}
.speaker-panel h4 { color: #8892b0; margin: 0 0 8px; font-size: 12px; }
.next-slide-mini {
  width: 100%; height: 120px; background: #fff;
  border-radius: 6px; overflow: hidden; padding: 10px; font-size: 8px;
}
.speaker-notes textarea {
  width: 100%; height: 120px; background: #0f3460;
  border: 1px solid #334; border-radius: 6px; color: #e0e0e0;
  padding: 10px; resize: none; font-size: 13px;
}
.timer { color: #fff; font-size: 28px; font-variant-numeric: tabular-nums; text-align: center; }
.timer button { margin-left: 12px; background: #334; color: #aaa; border: none; border-radius: 4px; padding: 4px 10px; cursor: pointer; }
.exit-btn {
  background: #e74c3c; color: #fff; border: none; border-radius: 6px;
  padding: 10px; font-size: 14px; cursor: pointer; margin-top: auto;
}
.exit-btn:hover { background: #c0392b; }
</style>
