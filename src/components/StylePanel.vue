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
.style-panel { padding: 12px; height: 100%; overflow-y: auto; font-size: 12px; }
.panel-empty { color: #999; font-size: 13px; text-align: center; margin-top: 40px; }
.panel-title { font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #eee; }
.clone-actions { display: flex; gap: 4px; margin-bottom: 12px; }
.clone-btn { flex: 1; padding: 5px 0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px; background: #f8f9fa; transition: all 0.15s; }
.clone-btn:hover { background: #e3f2fd; border-color: #1a73e8; color: #1a73e8; }
.del-btn:hover { background: #fce4ec; border-color: #e53935; color: #e53935; }
.section-label { font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin: 14px 0 8px; padding-top: 8px; border-top: 1px solid #f0f0f0; }
.prop-group { margin-bottom: 10px; }
.prop-group label, .prop-half label { display: block; font-size: 11px; color: #666; margin-bottom: 3px; }
.prop-group input[type="text"], .prop-group select, .prop-half input[type="text"], .prop-half select {
  width: 100%; padding: 5px 7px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; box-sizing: border-box;
}
.prop-row { display: flex; gap: 8px; margin-bottom: 10px; }
.prop-half { flex: 1; }
.color-row { display: flex; gap: 6px; align-items: center; }
.color-row input[type="color"] { width: 28px; height: 28px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; padding: 1px; }
.color-row input[type="text"] { flex: 1; }
.align-row { display: flex; gap: 3px; }
.align-row button { flex: 1; padding: 4px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 11px; background: #fff; }
.align-row button.active { background: #e3f2fd; border-color: #1a73e8; color: #1a73e8; }
.slider-row { display: flex; align-items: center; gap: 8px; }
.slider-row input[type="range"] { flex: 1; height: 4px; }
.slider-val { font-size: 11px; color: #666; min-width: 28px; }
</style>
