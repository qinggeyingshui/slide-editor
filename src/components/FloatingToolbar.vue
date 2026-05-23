<template>
  <div v-if="elStyles" class="floating-toolbar">
    <!-- Group: Font -->
    <div class="tb-group">
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
      <input class="tb-input size-input" type="text" :value="elStyles.fontSize" @change="apply('fontSize', $event.target.value)" title="字号">
    </div>
    <!-- Group: Format -->
    <div class="tb-group">
      <button class="tb-btn" :class="{active: parseInt(elStyles.fontWeight)>=700}" @click="toggleBold" title="加粗"><b>B</b></button>
      <button class="tb-btn italic-btn" :class="{active: elStyles.fontStyle==='italic'}" @click="toggleItalic" title="斜体"><i>I</i></button>
      <button class="tb-btn" :class="{active: elStyles.textDecoration && elStyles.textDecoration.includes('underline')}" @click="toggleDecoration('underline')" title="下划线"><u>U</u></button>
      <button class="tb-btn" :class="{active: elStyles.textDecoration && elStyles.textDecoration.includes('line-through')}" @click="toggleDecoration('line-through')" title="删除线"><s>S</s></button>
    </div>
    <!-- Group: Align (cycle) -->
    <div class="tb-group">
      <button class="tb-btn align-btn" @click="cycleAlign" :title="'对齐: ' + (elStyles.textAlign || 'left')">
        <svg v-if="!elStyles.textAlign || elStyles.textAlign==='left'" width="14" height="14" viewBox="0 0 14 14"><path d="M1 2h12M1 5h8M1 8h12M1 11h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <svg v-else-if="elStyles.textAlign==='center'" width="14" height="14" viewBox="0 0 14 14"><path d="M1 2h12M3 5h8M1 8h12M4 11h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 14 14"><path d="M1 2h12M6 5h7M1 8h12M8 11h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div>
    <!-- Group: Color -->
    <div class="tb-group">
      <label class="tb-color-wrap" title="文字颜色">
        <span class="color-label">A</span>
        <span class="color-indicator" :style="{backgroundColor: elStyles.color || '#000'}"></span>
        <input type="color" :value="toHex(elStyles.color)" @input="apply('color', $event.target.value)">
      </label>
      <label class="tb-color-wrap" title="背景色">
        <svg class="color-label" width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" rx="2" fill="currentColor" opacity="0.3"/><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
        <span class="color-indicator" :style="{backgroundColor: elStyles.backgroundColor || 'transparent'}"></span>
        <input type="color" :value="toHex(elStyles.backgroundColor)" @input="apply('backgroundColor', $event.target.value)">
      </label>
    </div>
    <!-- Group: Opacity -->
    <div class="tb-group">
      <input class="tb-input opacity-input" type="range" min="0" max="1" step="0.05" :value="elStyles.opacity" @input="apply('opacity', $event.target.value)" title="透明度">
    </div>
    <!-- Group: Border Radius -->
    <div class="tb-group">
      <svg class="tb-icon" width="14" height="14" viewBox="0 0 14 14"><path d="M2 10V6a4 4 0 014-4h4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
      <input class="tb-input radius-input" type="range" min="0" max="50" step="1" :value="parseRadius(elStyles.borderRadius)" @input="apply('borderRadius', $event.target.value + '%')" title="圆角">
      <span class="radius-val">{{ parseRadius(elStyles.borderRadius) }}%</span>
    </div>
    <!-- Group: Actions -->
    <div class="tb-group actions-group">
      <button class="tb-btn action-btn" @click="$emit('clone-before')" title="克隆到前面">
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 11V3M4 5l3-3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="tb-btn action-btn" @click="$emit('clone-after')" title="克隆到后面">
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 3v8M4 9l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      <button class="tb-btn action-btn" @click="$emit('ungroup')" title="解组 (Alt+G)">
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2h10v10H2z" stroke="currentColor" stroke-width="1.2" fill="none" stroke-dasharray="2 2"/><path d="M5 7h4M7 5v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      </button>
      <button class="tb-btn action-btn" @click="$emit('layer-up')" title="上移图层">
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 9l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      </button>
      <button class="tb-btn action-btn" @click="$emit('layer-down')" title="下移图层">
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      </button>
      <button class="tb-btn tb-delete" @click="$emit('delete-el')" title="删除">
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 4h8M5.5 4V3a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M4.5 4v7.5a1 1 0 001 1h3a1 1 0 001-1V4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ elStyles: Object })
const emit = defineEmits(['apply-style', 'clone-before', 'clone-after', 'delete-el', 'ungroup', 'layer-up', 'layer-down'])

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
function toggleDecoration(keyword) {
  const cur = props.elStyles.textDecoration || ''
  if (cur.includes(keyword)) {
    apply('textDecoration', cur.replace(keyword, '').trim() || 'none')
  } else {
    apply('textDecoration', (cur === 'none' ? '' : cur) + ' ' + keyword)
  }
}
function cycleAlign() {
  const cur = props.elStyles.textAlign || 'left'
  const next = cur === 'left' ? 'center' : cur === 'center' ? 'right' : 'left'
  apply('textAlign', next)
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
function parseRadius(val) {
  if (!val || val === '0px') return 0
  const m = val.match(/([\d.]+)%/)
  if (m) return Math.round(parseFloat(m[1]))
  const px = parseFloat(val)
  return isNaN(px) ? 0 : Math.min(50, Math.round(px / 2))
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
  top: 68px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
  white-space: nowrap;
  animation: floatIn 0.2s ease-out;
}
@keyframes floatIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* Group wrapper — Canva uses subtle vertical dividers */
.tb-group {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  border-right: 1.5px solid #e8e8e8;
}
.tb-group:last-child {
  border-right: none;
  padding-right: 0;
}
.tb-group:first-child {
  padding-left: 0;
}
.tb-group:hover {
  background: none;
}
.actions-group {
  background: transparent;
}

/* Buttons — Canva style: 40px tall, generous padding */
.tb-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  color: #0d1216;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
  line-height: 1;
}
.tb-btn:hover {
  background: #f0f0f0;
  color: #0d1216;
}
.tb-btn:active {
  background: #e4e4e4;
}
.tb-btn.active {
  background: #e8f0fe;
  color: #1a73e8;
}
.italic-btn { font-family: Georgia, serif; }

/* Delete */
.tb-delete {
  color: #5f6368;
}
.tb-delete:hover {
  background: #fce8e6;
  color: #d93025;
}

/* Select — Canva style: clean, 40px height, 15px font */
.tb-select {
  border: 1.5px solid #dadce0;
  border-radius: 10px;
  padding: 6px 30px 6px 12px;
  font-size: 15px;
  font-weight: 500;
  background: #fff;
  cursor: pointer;
  outline: none;
  color: #0d1216;
  height: 40px;
  transition: border-color 0.15s ease;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235f6368' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}
.tb-select:hover {
  border-color: #0d1216;
}
.tb-select:focus, .tb-input:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.15);
}
.font-select { width: 140px; }

/* Input — Canva style */
.tb-input {
  border: 1.5px solid #dadce0;
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  color: #0d1216;
  background: #fff;
  height: 40px;
  transition: border-color 0.15s ease;
}
.size-input { width: 56px; text-align: center; }

/* Range slider */
.opacity-input, .radius-input {
  accent-color: #1a73e8;
  border: none;
  cursor: pointer;
  height: 4px;
}
.opacity-input { width: 64px; }
.radius-input { width: 56px; }
.radius-val {
  font-size: 11px;
  color: #5f6368;
  min-width: 28px;
}
.tb-icon {
  color: #5f6368;
  flex-shrink: 0;
}

/* Color picker — Canva style */
.tb-color-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.15s ease;
}
.tb-color-wrap:hover {
  background: #f0f0f0;
}
.tb-color-wrap input[type="color"] {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  padding: 0;
  border: none;
  opacity: 0;
  cursor: pointer;
}
.color-label {
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  color: #0d1216;
}
.color-indicator {
  width: 20px;
  height: 4px;
  border-radius: 2px;
  margin-top: 4px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

/* SVG icons in buttons */
.tb-btn svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
.align-btn, .action-btn {
  padding: 8px 10px;
  min-width: 40px;
}
</style>
