import { ref } from 'vue'

const SVG_TAGS = ['path','rect','ellipse','circle','polygon','polyline','line']

function parseSvgFill(el) {
  const raw = el.getAttribute('fill') || ''
  if (!raw.startsWith('url(')) return raw
  const id = raw.match(/url\(#(.+?)\)/)?.[1]
  if (!id) return '#000000'
  const grad = el.closest('svg')?.querySelector(`#${id}`)
  if (!grad) return '#000000'
  const stop = grad.querySelector('stop')
  const c = stop?.getAttribute('stop-color') || stop?.style?.stopColor || '#000000'
  return c.startsWith('#') ? c : '#000000'
}

function isSvgShape(el) { return SVG_TAGS.includes(el?.tagName?.toLowerCase()) }

export function useElementStyle(currentSlide, getCanvasApi) {
  const selectedElStyles = ref(null)
  const formatBrushActive = ref(false)
  const formatBrushLocked = ref(false)
  let selectedDomEl = null
  let copiedStyles = null

  // Format brush: style properties to copy/paste
  const BRUSH_PROPS = [
    'fontFamily','fontSize','lineHeight','fontWeight','fontStyle','textDecoration',
    'textAlign','color','backgroundColor','opacity','borderRadius','border','boxShadow','padding'
  ]

  function copyStyleForBrush() {
    if (!selectedDomEl) return false
    const cs = getComputedStyle(selectedDomEl)
    copiedStyles = {}
    BRUSH_PROPS.forEach(p => { copiedStyles[p] = cs[p] })
    return true
  }

  function activateBrush(locked = false) {
    if (!copyStyleForBrush()) return
    formatBrushActive.value = true
    formatBrushLocked.value = locked
  }

  function deactivateBrush() {
    formatBrushActive.value = false
    formatBrushLocked.value = false
  }

  function applyBrushTo(el) {
    if (!copiedStyles || !el) return
    BRUSH_PROPS.forEach(p => {
      if (copiedStyles[p]) el.style[p] = copiedStyles[p]
    })
    // Inherit to children
    const inheritProps = ['color','backgroundColor','fontFamily','fontSize','fontWeight','textAlign','fontStyle','textDecoration']
    inheritProps.forEach(p => {
      if (copiedStyles[p]) {
        el.querySelectorAll('*').forEach(child => {
          if (child.style[p]) child.style[p] = copiedStyles[p]
        })
      }
    })
    syncDomToSlides()
    const api = getCanvasApi()
    if (api?.pushHistory) api.pushHistory()
    if (!formatBrushLocked.value) deactivateBrush()
  }

  function getSelectedDomEl() { return selectedDomEl }

  function onSelectElement(el) {
    selectedDomEl = el
    if (!el) { selectedElStyles.value = null; return }
    const cs = getComputedStyle(el)
    const svg = isSvgShape(el)
    selectedElStyles.value = {
      tagName: el.tagName.toLowerCase(), isSvg: svg,
      svgFill: svg ? parseSvgFill(el) : '',
      svgStroke: svg ? (el.getAttribute('stroke') || '') : '',
      svgStrokeWidth: svg ? (el.getAttribute('stroke-width') || '') : '',
      left: el.style?.left || cs.left, top: el.style?.top || cs.top,
      width: el.style?.width || cs.width, height: el.style?.height || cs.height,
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, lineHeight: cs.lineHeight,
      fontWeight: cs.fontWeight, fontStyle: cs.fontStyle, textDecoration: cs.textDecoration,
      textAlign: cs.textAlign, color: cs.color, backgroundColor: cs.backgroundColor,
      opacity: cs.opacity, borderRadius: cs.borderRadius,
      border: el.style?.border || cs.border,
      boxShadow: el.style?.boxShadow || cs.boxShadow,
      padding: el.style?.padding || cs.padding
    }
  }

  function syncDomToSlides() {
    const render = document.querySelector('.slide-render')
    if (render && currentSlide.value) currentSlide.value.innerHTML = render.innerHTML
  }

  function onApplyStyle(payload) {
    if (!selectedDomEl) return
    const { prop, value } = payload
    if (['svgFill','svgStroke','svgStrokeWidth'].includes(prop)) {
      const attrMap = { svgFill: 'fill', svgStroke: 'stroke', svgStrokeWidth: 'stroke-width' }
      selectedDomEl.setAttribute(attrMap[prop], value)
      onSelectElement(selectedDomEl); syncDomToSlides(); return
    }
    let finalValue = value
    if (prop === 'fontSize' && /^\d+(\.\d+)?$/.test(value)) finalValue = value + 'px'
    selectedDomEl.style[prop] = finalValue
    const inheritProps = ['color','backgroundColor','fontFamily','fontSize','fontWeight','textAlign','fontStyle','textDecoration']
    if (inheritProps.includes(prop)) {
      selectedDomEl.querySelectorAll('*').forEach(child => {
        if (child.style[prop]) child.style[prop] = finalValue
      })
    }
    onSelectElement(selectedDomEl); syncDomToSlides()
    const api = getCanvasApi()
    if (api?.pushHistory) api.pushHistory()
  }

  function onCloneBefore() {
    if (!selectedDomEl) return
    const clone = selectedDomEl.cloneNode(true)
    selectedDomEl.before(clone)
    const api = getCanvasApi()
    if (api?.pushHistory) api.pushHistory()
    syncDomToSlides(); onSelectElement(clone)
  }

  function onCloneAfter() {
    if (!selectedDomEl) return
    const clone = selectedDomEl.cloneNode(true)
    selectedDomEl.after(clone)
    const api = getCanvasApi()
    if (api?.pushHistory) api.pushHistory()
    syncDomToSlides(); onSelectElement(clone)
  }

  function onDeleteEl() {
    if (!selectedDomEl) return
    const next = selectedDomEl.nextElementSibling || selectedDomEl.previousElementSibling
    selectedDomEl.remove()
    const api = getCanvasApi()
    if (api?.pushHistory) api.pushHistory()
    syncDomToSlides()
    if (next) onSelectElement(next)
    else { selectedDomEl = null; selectedElStyles.value = null }
  }

  return { selectedElStyles, formatBrushActive, formatBrushLocked, getSelectedDomEl, onSelectElement, onApplyStyle, onCloneBefore, onCloneAfter, onDeleteEl, syncDomToSlides, activateBrush, deactivateBrush, applyBrushTo }
}
