<template>
  <div class="style-panel">
    <div v-if="!elStyles" class="panel-empty">点击页面中的元素进行编辑</div>
    <div v-else class="panel-content">
      <div class="panel-title">{{ elStyles.tagName }}</div>

      <!-- 克隆兄弟操作 -->
      <div class="clone-actions">
        <button class="clone-btn" @click="emit('clone-before')" title="在上方克隆插入">+ ↑</button>
        <button class="clone-btn" @click="emit('clone-after')" title="在下方克隆插入">+ ↓</button>
        <button class="clone-btn del-btn" @click="emit('delete-el')" title="删除元素">✕</button>
      </div>

      <!-- 位置 -->
      <div class="section-label">位置与尺寸</div>
      <div class="prop-row">
        <div class="prop-half">
          <label>X (left)</label>
          <input type="text" :value="elStyles.left" @change="apply('left', $event.target.value)">
        </div>
        <div class="prop-half">
          <label>Y (top)</label>
          <input type="text" :value="elStyles.top" @change="apply('top', $event.target.value)">
        </div>
      </div>
      <div class="prop-row">
        <div class="prop-half">
          <label>宽度</label>
          <input type="text" :value="elStyles.width" @change="apply('width', $event.target.value)">
        </div>
        <div class="prop-half">
          <label>高度</label>
          <input type="text" :value="elStyles.height" @change="apply('height', $event.target.value)">
        </div>
      </div>

      <!-- 字体 -->
      <div class="section-label">文字</div>
      <div class="prop-group">
        <label>字体</label>
        <select :value="parseFontFamily(elStyles.fontFamily)" @change="apply('fontFamily', $event.target.value)">
          <option value="Arial">Arial</option>
          <option value="'Helvetica Neue'">Helvetica Neue</option>
          <option value="'Microsoft YaHei'">微软雅黑</option>
          <option value="'PingFang SC'">苹方</option>
          <option value="'Source Han Sans'">思源黑体</option>
          <option value="'Noto Sans SC'">Noto Sans</option>
          <option value="Georgia">Georgia</option>
          <option value="'Courier New'">Courier New</option>
          <option value="'Arial Black'">Arial Black</option>
        </select>
      </div>
      <div class="prop-row">
        <div class="prop-half">
          <label>字号</label>
          <input type="text" :value="elStyles.fontSize" @change="apply('fontSize', $event.target.value)">
        </div>
        <div class="prop-half">
          <label>行高</label>
          <input type="text" :value="elStyles.lineHeight" @change="apply('lineHeight', $event.target.value)">
        </div>
      </div>
      <div class="prop-row">
        <div class="prop-half">
          <label>字重</label>
          <select :value="elStyles.fontWeight" @change="apply('fontWeight', $event.target.value)">
            <option value="300">Light</option>
            <option value="400">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="700">Bold</option>
            <option value="800">Extra Bold</option>
            <option value="900">Black</option>
          </select>
        </div>
        <div class="prop-half">
          <label>字间距</label>
          <input type="text" :value="elStyles.letterSpacing" @change="apply('letterSpacing', $event.target.value)">
        </div>
      </div>
      <div class="prop-group">
        <label>对齐</label>
        <div class="align-row">
          <button @click="apply('textAlign','left')" :class="{active: elStyles.textAlign==='left'}">左</button>
          <button @click="apply('textAlign','center')" :class="{active: elStyles.textAlign==='center'}">中</button>
          <button @click="apply('textAlign','right')" :class="{active: elStyles.textAlign==='right'}">右</button>
        </div>
      </div>

      <!-- 颜色 -->
      <div class="section-label">颜色</div>
      <div class="prop-group">
        <label>文字颜色</label>
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
        <label>透明度</label>
        <div class="slider-row">
          <input type="range" min="0" max="1" step="0.05" :value="elStyles.opacity" @input="apply('opacity', $event.target.value)">
          <span class="slider-val">{{ elStyles.opacity }}</span>
        </div>
      </div>

      <!-- 外观 -->
      <div class="section-label">外观</div>
      <div class="prop-row">
        <div class="prop-half">
          <label>圆角</label>
          <input type="text" :value="elStyles.borderRadius" @change="apply('borderRadius', $event.target.value)">
        </div>
        <div class="prop-half">
          <label>内边距</label>
          <input type="text" :value="elStyles.padding" @change="apply('padding', $event.target.value)">
        </div>
      </div>
      <div class="prop-group">
        <label>边框</label>
        <input type="text" :value="elStyles.border" @change="apply('border', $event.target.value)" placeholder="1px solid #ccc">
      </div>
      <div class="prop-group">
        <label>阴影</label>
        <input type="text" :value="elStyles.boxShadow" @change="apply('boxShadow', $event.target.value)" placeholder="0 2px 8px rgba(0,0,0,0.1)">
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ elStyles: Object })
const emit = defineEmits(['apply-style', 'clone-before', 'clone-after', 'delete-el'])

function apply(prop, value) { emit('apply-style', prop, value) }

function parseFontFamily(val) {
  if (!val) return 'Arial'
  // Strip quotes and return first family
  return val.split(',')[0].trim().replace(/^["']|["']$/g, '')
}

function toHex(color) {
  if (!color || color === 'transparent' || color.startsWith('rgba(0, 0, 0, 0')) return '#ffffff'
  if (color.startsWith('#')) return color
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return '#000000'
  return '#' + [m[1],m[2],m[3]].map(x => parseInt(x).toString(16).padStart(2,'0')).join('')
}
</script>

<style scoped>
.style-panel {
  padding: 16px; height: 100%; overflow-y: auto; font-size: 12px;
  background: var(--color-surface);
}
.style-panel::-webkit-scrollbar { width: 4px; }
.style-panel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
.panel-empty {
  color: var(--color-text-muted); font-size: 13px;
  text-align: center; margin-top: 60px; line-height: 1.6;
}
.panel-title {
  font-size: 13px; font-weight: 600; color: var(--color-text-primary);
  margin-bottom: 12px; padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}
.clone-actions { display: flex; gap: 6px; margin-bottom: 16px; }
.clone-btn {
  flex: 1; padding: 7px 0; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); cursor: pointer; font-size: 12px;
  background: var(--color-surface); color: var(--color-text-secondary);
  transition: all var(--transition-fast); font-weight: 500;
}
.clone-btn:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary); color: var(--color-primary);
  transform: translateY(-1px); box-shadow: var(--shadow-sm);
}
.clone-btn:active { transform: translateY(0); }
.del-btn:hover {
  background: var(--color-danger-light);
  border-color: var(--color-danger); color: var(--color-danger);
}
.section-label {
  font-size: 11px; font-weight: 600; color: var(--color-text-muted);
  text-transform: uppercase; letter-spacing: 0.5px;
  margin: 18px 0 10px; padding-top: 10px;
  border-top: 1px solid var(--color-border);
}
.prop-group { margin-bottom: 12px; }
.prop-group label, .prop-half label {
  display: block; font-size: 11px; color: var(--color-text-secondary);
  margin-bottom: 4px; font-weight: 500;
}
.prop-group input[type="text"], .prop-group select,
.prop-half input[type="text"], .prop-half select {
  width: 100%; padding: 6px 8px; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); font-size: 12px; box-sizing: border-box;
  color: var(--color-text-primary); background: var(--color-surface);
  transition: border-color var(--transition-fast);
}
.prop-group input[type="text"]:focus, .prop-group select:focus,
.prop-half input[type="text"]:focus, .prop-half select:focus {
  border-color: var(--color-primary); outline: none;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.08);
}
.prop-row { display: flex; gap: 10px; margin-bottom: 12px; }
.prop-half { flex: 1; }
.color-row { display: flex; gap: 8px; align-items: center; }
.color-row input[type="color"] {
  width: 32px; height: 32px; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); cursor: pointer; padding: 2px;
  transition: border-color var(--transition-fast);
}
.color-row input[type="color"]:hover { border-color: var(--color-border-hover); }
.color-row input[type="text"] { flex: 1; }
.align-row { display: flex; gap: 4px; }
.align-row button {
  flex: 1; padding: 6px; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); cursor: pointer; font-size: 11px;
  background: var(--color-surface); color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}
.align-row button:hover { background: var(--color-surface-alt); }
.align-row button.active {
  background: var(--color-primary-light);
  border-color: var(--color-primary); color: var(--color-primary);
}
.slider-row { display: flex; align-items: center; gap: 10px; }
.slider-row input[type="range"] { flex: 1; height: 4px; accent-color: var(--color-primary); }
.slider-val { font-size: 11px; color: var(--color-text-muted); min-width: 32px; text-align: right; }
</style>
