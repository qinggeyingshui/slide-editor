import { ref } from 'vue'
import { createShape } from '../model/types.js'

export function useShapes(currentSlide) {
  const selectedShape = ref(null)
  const shapeDrag = ref(null)
  const shapeResize = ref(null)
  const showShapes = ref(false)

  function addShape(type) {
    const s = createShape(type)
    currentSlide.value.shapes.push(s)
    selectedShape.value = s.id
    showShapes.value = false
  }

  function deleteShape() {
    if (!selectedShape.value) return
    const idx = currentSlide.value.shapes.findIndex(s => s.id === selectedShape.value)
    if (idx >= 0) currentSlide.value.shapes.splice(idx, 1)
    selectedShape.value = null
  }

  function startShapeDrag(e, shape) {
    selectedShape.value = shape.id
    const svg = e.target.closest('svg')
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
    shapeDrag.value = { id: shape.id, startX: svgP.x, startY: svgP.y, origX: shape.x, origY: shape.y }
  }

  function startShapeResize(e, shape) {
    e.stopPropagation()
    const svg = e.target.closest('svg')
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
    shapeResize.value = { id: shape.id, startX: svgP.x, startY: svgP.y, origW: shape.w, origH: shape.h }
  }

  function onShapeMove(e) {
    if (!shapeDrag.value && !shapeResize.value) return
    const svg = e.target.closest('svg') || e.currentTarget
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())

    if (shapeDrag.value) {
      const shape = currentSlide.value.shapes.find(s => s.id === shapeDrag.value.id)
      if (shape) {
        shape.x = shapeDrag.value.origX + (svgP.x - shapeDrag.value.startX)
        shape.y = shapeDrag.value.origY + (svgP.y - shapeDrag.value.startY)
      }
    }
    if (shapeResize.value) {
      const shape = currentSlide.value.shapes.find(s => s.id === shapeResize.value.id)
      if (shape) {
        shape.w = Math.max(20, shapeResize.value.origW + (svgP.x - shapeResize.value.startX))
        shape.h = Math.max(20, shapeResize.value.origH + (svgP.y - shapeResize.value.startY))
      }
    }
  }

  function onShapeUp() {
    shapeDrag.value = null
    shapeResize.value = null
  }

  function clearShapeSelection() { selectedShape.value = null }

  return {
    selectedShape, showShapes,
    addShape, deleteShape,
    startShapeDrag, startShapeResize, onShapeMove, onShapeUp,
    clearShapeSelection
  }
}
