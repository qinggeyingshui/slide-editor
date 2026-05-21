<template>
  <div class="style-panel">
    <div v-if="!elStyles" class="panel-empty">点击页面中的元素进行编辑</div>
    <div v-else class="panel-content">
      <div class="panel-title">{{ elStyles.tagName }}</div>
      <div class="prop-group">
        <label>字号</label>
        <input type="text" :value="elStyles.fontSize" @change="apply('fontSize', $event.target.value)">
      </div>
      <div class="prop-group">
        <label>颜色</label>
        <div class="color-row">
          <input type="color" :value="toHex(elStyles.color)" @input="apply('color', $event.target.value)">
          <input type="text" :value="elStyles.color" @change="apply('color', $event.target.value)">
        </div>
      </div>
      <div class="prop-group">
        <label>背景色</label>
        <div class="color-row">
          <input type="color" :value="toHex(elStyles.backgroundColor)" @input="apply('backgroundColor', $event.target.value)">
          <input type="text" :value="elStyles.backgroundColor" @change="apply('backgroundColor', $event.target.value)">
        </div>
      </div>
      <div class="prop-group">
        <label>字重</label>
        <select :value="elStyles.fontWeight" @change="apply('fontWeight', $event.target.value)">
          <option value="400">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semi Bold</option>
          <option value="700">Bold</option>
          <option value="800">Extra Bold</option>
        </select>
      </div>
      <div class="prop-group">
        <label>对齐</label>
        <div class="align-row">
          <button @click="apply('textAlign','left')" :class="{active: elStyles.textAlign==='left'}">左</button>
          <button @click="apply('textAlign','center')" :class="{active: elStyles.textAlign==='center'}">中</button>
          <button @click="apply('textAlign','right')" :class="{active: elStyles.textAlign==='right'}">右</button>
        </div>
      </div>
      <div class="prop-group">
        <label>内边距</label>
        <input type="text" :value="elStyles.padding" @change="apply('padding', $event.target.value)">
      </div>
      <div class="prop-group">
        <label>圆角</label>
        <input type="text" :value="elStyles.borderRadius" @change="apply('borderRadius', $event.target.value)">
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ elStyles: Object })
const emit = defineEmits(['apply-style'])

function apply(prop, value) { emit('apply-style', prop, value) }

function toHex(color) {
  if (!color || color === 'transparent' || color.startsWith('rgba(0, 0, 0, 0')) return '#ffffff'
  if (color.startsWith('#')) return color
  const m = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!m) return '#000000'
  return '#' + [m[1],m[2],m[3]].map(x => parseInt(x).toString(16).padStart(2,'0')).join('')
}
</script>

<style scoped>
.style-panel { padding: 16px; height: 100%; overflow-y: auto; }
.panel-empty { color: #999; font-size: 13px; text-align: center; margin-top: 40px; }
.panel-title { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
.prop-group { margin-bottom: 12px; }
.prop-group label { display: block; font-size: 12px; color: #666; margin-bottom: 4px; }
.prop-group input[type="text"], .prop-group select {
  width: 100%; padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;
}
.color-row { display: flex; gap: 8px; align-items: center; }
.color-row input[type="color"] { width: 32px; height: 32px; border: none; cursor: pointer; }
.color-row input[type="text"] { flex: 1; }
.align-row { display: flex; gap: 4px; }
.align-row button { flex: 1; padding: 4px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px; background: #fff; }
.align-row button.active { background: #e3f2fd; border-color: #1a73e8; color: #1a73e8; }
</style>
