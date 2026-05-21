<template>
  <div class="editor">
    <Toolbar
      :showShapes="showShapes"
      :selectedShape="selectedShape"
      :selectedBlock="selectedBlock"
      @addSlide="addSlide"
      @addBlock="addBlock"
      @imageUpload="handleImageUpload($event, currentSlide, addBlock)"
      @toggleShapes="showShapes = !showShapes"
      @addShape="addShape"
      @deleteSlide="deleteSlide"
      @duplicateSlide="duplicateSlide"
      @deleteShape="deleteShape"
      @deleteBlock="deleteBlock"
    />
    <div class="main">
      <SlideList :slides="slides" :currentIndex="currentIndex" @select="currentIndex = $event" />
      <div class="canvas-wrap">
        <div class="canvas" :style="canvasStyle">
          <div class="slide-bg" :style="bgStyle"></div>
          <div class="blocks-layer">
            <BlockRenderer
              v-for="(block, i) in currentSlide.blocks" :key="block.id"
              :block="block"
              :isSelected="selected === block.id"
              @select="selectBlock"
              @edit="onEdit"
              @dragstart="dragStart(i)"
              @drop="drop(i)"
              @imgdrag="startImgDrag"
              @imgresize="startImgResize"
            />
          </div>
          <ShapeLayer
            :shapes="currentSlide.shapes || []"
            :selectedShape="selectedShape"
            @shapedrag="startShapeDrag"
            @shaperesize="startShapeResize"
            @shapemove="onShapeMove"
            @shapeup="onShapeUp"
            @clearselection="clearShapeSelection"
          />
        </div>
      </div>
      <PropsPanel
        :slide="currentSlide"
        :selectedBlock="selectedBlock"
        :selectedShapeObj="selectedShapeObj"
        @setBgColor="currentSlide.bgColor = $event"
        @setBg="onSetBg"
        @setBlockStyle="setBlockStyle"
        @setShapeProp="setShapeProp"
        @applyTheme="onApplyTheme"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Toolbar from './components/Toolbar.vue'
import SlideList from './components/SlideList.vue'
import BlockRenderer from './components/BlockRenderer.vue'
import ShapeLayer from './components/ShapeLayer.vue'
import PropsPanel from './components/PropsPanel.vue'
import { useSlides } from './composables/useSlides.js'
import { useShapes } from './composables/useShapes.js'
import { useImageDrag } from './composables/useImageDrag.js'
import { themes, applyTheme } from './model/themes.js'

const {
  slides, currentIndex, selected, currentSlide, selectedBlock,
  addSlide, deleteSlide, duplicateSlide,
  addBlock, deleteBlock, selectBlock, clearSelection,
  dragStart, drop, onEdit, setBlockStyle
} = useSlides()

const {
  selectedShape, showShapes,
  addShape, deleteShape,
  startShapeDrag, startShapeResize, onShapeMove, onShapeUp,
  clearShapeSelection
} = useShapes(currentSlide)

const { startImgDrag, startImgResize, handleImageUpload } = useImageDrag()

const selectedShapeObj = computed(() => {
  if (!selectedShape.value || !currentSlide.value.shapes) return null
  return currentSlide.value.shapes.find(s => s.id === selectedShape.value)
})

const canvasStyle = computed(() => ({
  width: '1280px', height: '720px',
  position: 'relative', overflow: 'hidden', borderRadius: '8px',
  boxShadow: '0 2px 12px rgba(0,0,0,.08)'
}))

const bgStyle = computed(() => ({
  position: 'absolute', inset: 0,
  backgroundColor: currentSlide.value.bgColor || '#fff',
  backgroundImage: currentSlide.value.bg ? `url(${currentSlide.value.bg})` : 'none',
  backgroundSize: 'cover', backgroundPosition: 'center'
}))

function onSetBg(val) {
  if (val === 'custom') {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = 'image/*'
    input.onchange = (e) => {
      const reader = new FileReader()
      reader.onload = (ev) => { currentSlide.value.bg = ev.target.result }
      reader.readAsDataURL(e.target.files[0])
    }
    input.click()
  } else {
    currentSlide.value.bg = val
  }
}

function setShapeProp(prop, val) {
  if (selectedShapeObj.value) selectedShapeObj.value[prop] = val
}

function onApplyTheme(key) {
  applyTheme(slides.value, themes[key])
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.editor { display: flex; flex-direction: column; height: 100vh; background: #f8f9fb; }
.main { display: flex; flex: 1; overflow: hidden; }
.slide-list { width: 160px; background: #fff; border-right: 1px solid #eee; }
.canvas-wrap { flex: 1; display: flex; align-items: center; justify-content: center; padding: 10px; overflow: hidden; }
.canvas { transform-origin: center; }
.blocks-layer { position: relative; z-index: 1; padding: 40px; min-height: 100%; }
.props-panel { width: 220px; background: #fff; border-left: 1px solid #eee; }
</style>
