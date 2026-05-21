<template>
  <div class="toolbar">
    <div class="tb-group">
      <button @click="$emit('addSlide','blank')">+ 空白页</button>
      <button @click="$emit('addSlide','title')">+ 标题页</button>
      <button @click="$emit('addSlide','content')">+ 内容页</button>
    </div>
    <div class="tb-group">
      <button @click="$emit('addBlock','heading')">H 标题</button>
      <button @click="$emit('addBlock','text')">T 文本</button>
      <button @click="$emit('addBlock','list')">☰ 列表</button>
      <button @click="$emit('addBlock','cards')">▦ 卡片</button>
      <label class="tb-btn">🖼 图片<input type="file" accept="image/*" hidden @change="$emit('imageUpload',$event)"></label>
    </div>
    <div class="tb-group" style="position:relative">
      <button @click="$emit('toggleShapes')">◇ 形状 ▾</button>
      <div v-if="showShapes" class="shape-dropdown">
        <button @click="$emit('addShape','rect')">▭ 矩形</button>
        <button @click="$emit('addShape','ellipse')">○ 椭圆</button>
        <button @click="$emit('addShape','triangle')">△ 三角</button>
        <button @click="$emit('addShape','line')">— 线段</button>
        <button @click="$emit('addShape','arrow')">→ 箭头</button>
      </div>
    </div>
    <div class="tb-group">
      <button @click="$emit('deleteSlide')">🗑 删页</button>
      <button @click="$emit('duplicateSlide')">⎘ 复制页</button>
      <button v-if="selectedShape" @click="$emit('deleteShape')">✕ 删形状</button>
      <button v-if="selectedBlock" @click="$emit('deleteBlock')">✕ 删块</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showShapes: Boolean,
  selectedShape: String,
  selectedBlock: Object
})
defineEmits(['addSlide','addBlock','imageUpload','toggleShapes','addShape','deleteSlide','duplicateSlide','deleteShape','deleteBlock'])
</script>

<style scoped>
.toolbar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #fff; border-bottom: 1px solid #eee; flex-wrap: wrap; }
.tb-group { display: flex; gap: 4px; padding-right: 10px; border-right: 1px solid #eee; }
.tb-group:last-child { border-right: none; }
.toolbar button, .tb-btn { padding: 5px 10px; border: 1px solid #e0e0e0; border-radius: 4px; background: #fafafa; cursor: pointer; font-size: 12px; white-space: nowrap; }
.toolbar button:hover, .tb-btn:hover { background: #eef2ff; border-color: #3b5fe0; }
.shape-dropdown { position: absolute; top: 100%; left: 0; background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,.1); padding: 4px; z-index: 100; display: flex; flex-direction: column; gap: 2px; }
.shape-dropdown button { text-align: left; border: none; padding: 6px 12px; }
</style>
