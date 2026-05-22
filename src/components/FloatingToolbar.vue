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
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-float);
  border: 1px solid var(--color-border);
  white-space: nowrap;
  animation: floatIn 0.2s ease-out;
}
@keyframes floatIn { from { opacity: 0; transform: translateX(-50%) translateY(-6px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
.tb-sep { width: 1px; height: 20px; background: var(--color-border); margin: 0 4px; }
.tb-btn {
  border: none; background: none; cursor: pointer; padding: 6px 10px;
  border-radius: var(--radius-sm); font-size: 14px;
  color: var(--color-text-secondary); min-width: 30px;
  transition: all var(--transition-fast);
}
.tb-btn:hover { background: var(--color-surface-alt); color: var(--color-text-primary); transform: scale(1.05); }
.tb-btn:active { transform: scale(0.95); }
.tb-btn.active { background: var(--color-primary-light); color: var(--color-primary); }
.tb-delete { color: var(--color-danger); }
.tb-delete:hover { background: var(--color-danger-light); color: var(--color-danger); }
.tb-select {
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  padding: 4px 8px; font-size: 12px; background: var(--color-surface);
  cursor: pointer; outline: none; color: var(--color-text-secondary);
  transition: border-color var(--transition-fast);
}
.tb-select:hover { border-color: var(--color-border-hover); }
.tb-select:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1); }
.font-select { width: 110px; }
.tb-input {
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  padding: 4px 8px; font-size: 12px; outline: none;
  color: var(--color-text-primary);
  transition: border-color var(--transition-fast);
}
.tb-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1); }
.size-input { width: 50px; text-align: center; }
.opacity-input { width: 64px; accent-color: var(--color-primary); border: none; cursor: pointer; }
.tb-color-wrap {
  display: flex; flex-direction: column; align-items: center; cursor: pointer;
  position: relative; padding: 3px 6px; border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}
.tb-color-wrap:hover { background: var(--color-surface-alt); }
.tb-color-wrap input[type="color"] {
  position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%);
  width: 0; height: 0; padding: 0; border: none; opacity: 0; cursor: pointer;
}
.color-label { font-size: 14px; font-weight: 700; line-height: 1; color: var(--color-text-primary); }
.color-indicator { width: 18px; height: 3px; border-radius: 2px; margin-top: 2px; }
</style>
