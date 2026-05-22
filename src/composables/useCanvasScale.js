import { ref, computed } from 'vue'

export function useCanvasScale(canvasWrapRef) {
  const canvasScale = ref(1)

  function updateScale() {
    if (!canvasWrapRef.value) return
    const w = canvasWrapRef.value.clientWidth
    const h = canvasWrapRef.value.clientHeight
    canvasScale.value = Math.min(w / 960, h / 540) * 0.92
  }

  const canvasTransform = computed(() => {
    const s = canvasScale.value
    return { width: (960 * s) + 'px', height: (540 * s) + 'px' }
  })

  const innerTransform = computed(() => ({
    transform: `scale(${canvasScale.value})`,
    transformOrigin: 'top left',
    width: '960px',
    height: '540px'
  }))

  return { canvasScale, updateScale, canvasTransform, innerTransform }
}
