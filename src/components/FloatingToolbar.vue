<template>
  <div v-if="elStyles" class="floating-toolbar">
      <!-- Font family -->
      <select class="tb-select font-select" :value="parseFontFamily(elStyles.fontFamily)" @change="apply('fontFamily', $event.target.value)">
        <option value="Arial">Arial</option>
        <option value="'Helvetica Neue'">Helvetica</option>
        <option value="'Microsoft YaHei'">微软雅黑</option>
        <option value="'PingFang SC'">苹方</option>
        <option value="'Source Han Sans'">思源黑体</option>
        <option value="'Noto Sans SC'">Noto Sans</option>
        <option value="'SimSun'">宋体</option>
        <option value="'KaiTi'">楷体</option>
        <option value="'FangSong'">仿宋</option>
        <option value="Georgia">Georgia</option>
        <option value="'Times New Roman'">Times NR</option>
        <option value="'Courier New'">Courier</option>
        <option value="'Inter'">Inter</option>
        <option value="'Roboto'">Roboto</option>
        <option value="'Montserrat'">Montserrat</option>
        <option value="'Lato'">Lato</option>
        <option value="'Open Sans'">Open Sans</option>
      </select>
      <div class="tb-sep"></div>
      <!-- Font size -->
      <input class="tb-input size-input" type="text" :value="elStyles.fontSize" @change="apply('fontSize', $event.target.value)" title="字号">
      <div class="tb-sep"></div>
      <!-- Font weight -->
      <button class="tb-btn" :class="{active: parseInt(elStyles.fontWeight)>=700}" @click="toggleBold" title="加粗"><b>B</b></button>
      <button class="tb-btn" :class="{active: elStyles.fontStyle==='italic'}" @click="toggleItalic" title="斜体"><i>I</i></button>
      <button class="tb-btn" :class="{active: elStyles.textDecoration && elStyles.textDecoration.includes('underline')}" @click="toggleUnderline" title="下划线"><u>U</u></button>
      <button class="tb-btn" :class="{active: elStyles.textDecoration && elStyles.textDecoration.includes('line-through')}" @click="toggleStrikethrough" title="删除线"><s>S</s></button>
      <div class="tb-sep"></div>
      <!-- Text align -->
      <button class="tb-btn" :class="{active: elStyles.textAlign==='left'}" @click="apply('textAlign','left')" title="左对齐">≡</button>
      <button class="tb-btn" :class="{active: elStyles.textAlign==='center'}" @click="apply('textAlign','center')" title="居中">☰</button>
      <button class="tb-btn" :class="{active: elStyles.textAlign==='right'}" @click="apply('textAlign','right')" title="右对齐">≡</button>
      <div class="tb-sep"></div>
      <!-- Text color -->
      <label class="tb-color-wrap" title="文字颜色">
        <span class="color-label">A</span>
        <span class="color-indicator" :style="{backgroundColor: elStyles.color || '#000'}"></span>
        <input type="color" :value="toHex(elStyles.color)" @input="apply('color', $event.target.value)">
      </label>
      <!-- Background color -->
      <label class="tb-color-wrap" title="背景色">
        <span class="color-label">⬛</span>
        <span class="color-indicator" :style="{backgroundColor: elStyles.backgroundColor || 'transparent'}"></span>
        <input type="color" :value="toHex(elStyles.backgroundColor)" @input="apply('backgroundColor', $event.target.value)">
      </label>
      <div class="tb-sep"></div>
      <!-- Opacity -->
      <input class="tb-input opacity-input" type="range" min="0" max="1" step="0.05" :value="elStyles.opacity" @input="apply('opacity', $event.target.value)" title="透明度">
      <div class="tb-sep"></div>
      <!-- Clone -->
      <button class="tb-btn" @click="$emit('clone-before')" title="克隆到前面">⬆️</button>
      <button class="tb-btn" @click="$emit('clone-after')" title="克隆到后面">⬇️</button>
      <div class="tb-sep"></div>
      <!-- Delete -->
      <button class="tb-btn tb-delete" @click="$emit('delete-el')" title="删除">🗑</button>
    </div>
</template>

<script setup>
const props = defineProps({ elStyles: Object })
const emit = defineEmits(['apply-style', 'clone-before', 'clone-after', 'delete-el'])

function apply(prop, value) {
  emit('apply-style', { prop, value })
}
function toggleBold() {
  const cur = parseInt(props.elStyles.fontWeight) || 400
  apply('fontWeight', cur >= 700 ? '400' : '700')
}
function toggleItalic() {
  const cur = props.elStyles.fontStyle
  apply('fontStyle', cur === 'italic' ? 'normal' : 'italic')
}
function toggleUnderline() {
  const cur = props.elStyles.textDecoration || ''
  if (cur.includes('underline')) {
    apply('textDecoration', cur.replace('underline', '').trim() || 'none')
  } else {
    apply('textDecoration', (cur === 'none' ? '' : cur) + ' underline')
  }
}
function toggleStrikethrough() {
  const cur = props.elStyles.textDecoration || ''
  if (cur.includes('line-through')) {
    apply('textDecoration', cur.replace('line-through', '').trim() || 'none')
  } else {
    apply('textDecoration', (cur === 'none' ? '' : cur) + ' line-through')
  }
}
function parseFontFamily(val) {
  if (!val) return 'Arial'
  // Strip quotes and match first font
  const clean = val.replace(/['"]/g, '').split(',')[0].trim()
  const map = { 'Arial': 'Arial', 'Helvetica Neue': "'Helvetica Neue'", 'Microsoft YaHei': "'Microsoft YaHei'",
    'PingFang SC': "'PingFang SC'", 'Source Han Sans': "'Source Han Sans'", 'Georgia': 'Georgia', 'Courier New': "'Courier New'" }
  for (const [k, v] of Object.entries(map)) { if (clean.includes(k)) return v }
  return 'Arial'
}
function toHex(color) {
  if (!color || color === 'transparent') return '#000000'
  if (color.startsWith('#')) return color.length === 4 ? color + color.slice(1) : color
  const m = color.match(/\d+/g)
  if (m && m.length >= 3) return '#' + m.slice(0,3).map(n => parseInt(n).toString(16).padStart(2,'0')).join('')
  return '#000000'
}
</script>

<style scoped>
.floating-toolbar {
  position: fixed;
  top: 56px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  border: 1px solid #e0e0e0;
  white-space: nowrap;
}
.tb-sep { width: 1px; height: 20px; background: #e0e0e0; margin: 0 4px; }
.tb-btn {
  border: none; background: none; cursor: pointer; padding: 4px 8px;
  border-radius: 4px; font-size: 14px; color: #333; min-width: 28px;
}
.tb-btn:hover { background: #f0f0f0; }
.tb-btn.active { background: #e3e8ff; color: #4a6cf7; }
.tb-delete { color: #e53935; }
.tb-delete:hover { background: #fdecea; }
.tb-select {
  border: 1px solid #ddd; border-radius: 4px; padding: 3px 6px;
  font-size: 12px; background: #fff; cursor: pointer; outline: none;
}
.font-select { width: 100px; }
.tb-input { border: 1px solid #ddd; border-radius: 4px; padding: 3px 6px; font-size: 12px; outline: none; }
.size-input { width: 48px; text-align: center; }
.opacity-input { width: 60px; accent-color: #4a6cf7; border: none; }
.tb-color-wrap {
  display: flex; flex-direction: column; align-items: center; cursor: pointer;
  position: relative; padding: 2px 4px;
}
.tb-color-wrap input[type="color"] {
  position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%);
  width: 0; height: 0; padding: 0; border: none; opacity: 0; cursor: pointer;
}
.color-label { font-size: 14px; font-weight: 700; line-height: 1; }
.color-indicator { width: 16px; height: 3px; border-radius: 1px; margin-top: 1px; }
</style>
