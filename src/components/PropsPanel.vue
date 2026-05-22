<template>
  <div class="props-panel">
    <h3>页面</h3>
    <div class="prop-group">
      <label>背景色</label>
      <input type="color" :value="slide?.bgColor||'#ffffff'" @input="$emit('setBgColor',$event.target.value)">
    </div>
    <div class="prop-group">
      <label>背景图</label>
      <select :value="slide?.bg||''" @change="$emit('setBg',$event.target.value)">
        <option value="">无</option>
        <option value="/assets/slide1_bg.png">封面版式</option>
        <option value="/assets/slide2_bg.png">内容版式A</option>
        <option value="/assets/slide5_bg.png">内容版式B</option>
        <option value="/assets/slide8_bg.png">数据版式</option>
        <option value="/assets/slide11_bg.png">总结版式</option>
        <option value="/assets/slide14_bg.png">结尾版式</option>
        <option value="custom">自定义上传...</option>
      </select>
    </div>
    <hr>
    <template v-if="selectedBlock">
      <h3>块属性 ({{ selectedBlock.type }})</h3>
      <div class="prop-group">
        <label>文字颜色</label>
        <input type="color" :value="selectedBlock.style?.color||'#1A1A2E'" @input="$emit('setBlockStyle','color',$event.target.value)">
      </div>
      <div class="prop-group">
        <label>字号</label>
        <input type="range" min="12" max="72" :value="parseInt(selectedBlock.style?.fontSize)||16" @input="$emit('setBlockStyle','fontSize',$event.target.value+'px')">
        <span>{{ parseInt(selectedBlock.style?.fontSize)||16 }}px</span>
      </div>
      <div class="prop-group">
        <label>对齐</label>
        <select :value="selectedBlock.style?.textAlign||'left'" @change="$emit('setBlockStyle','textAlign',$event.target.value)">
          <option value="left">左</option>
          <option value="center">中</option>
          <option value="right">右</option>
        </select>
      </div>
    </template>
    <template v-if="selectedShapeObj">
      <hr>
      <h3>形状属性</h3>
      <div class="prop-group">
        <label>填充</label>
        <input type="color" :value="selectedShapeObj.fill||'#3b82f6'" @input="$emit('setShapeProp','fill',$event.target.value)">
      </div>
      <div class="prop-group">
        <label>描边</label>
        <input type="color" :value="selectedShapeObj.stroke||'#1e40af'" @input="$emit('setShapeProp','stroke',$event.target.value)">
      </div>
      <div class="prop-group">
        <label>透明度</label>
        <input type="range" min="0" max="100" :value="(selectedShapeObj.opacity||1)*100" @input="$emit('setShapeProp','opacity',$event.target.value/100)">
      </div>
    </template>
    <template v-if="selectedElStyles?.isSvg">
      <hr>
      <h3>SVG 颜色</h3>
      <div class="prop-group">
        <label>填充</label>
        <input type="color" :value="selectedElStyles.svgFill||'#000000'" @input="$emit('applyStyle',{prop:'svgFill',value:$event.target.value})">
        <label class="no-fill"><input type="checkbox" :checked="selectedElStyles.svgFill==='none'" @change="$emit('applyStyle',{prop:'svgFill',value:$event.target.checked?'none':'#000000'})">无</label>
      </div>
      <div class="prop-group">
        <label>描边</label>
        <input type="color" :value="selectedElStyles.svgStroke||'#000000'" @input="$emit('applyStyle',{prop:'svgStroke',value:$event.target.value})">
      </div>
      <div class="prop-group">
        <label>线宽</label>
        <input type="range" min="0" max="20" step="0.5" :value="selectedElStyles.svgStrokeWidth||1" @input="$emit('applyStyle',{prop:'svgStrokeWidth',value:$event.target.value})">
        <span>{{ selectedElStyles.svgStrokeWidth||1 }}</span>
      </div>
    </template>
    <hr>
    <h3>主题</h3>
    <div class="theme-btns">
      <button v-for="(t,key) in themes" :key="key" @click="$emit('applyTheme',key)"
        :style="{background: t.accent, color: '#fff'}">{{ t.name }}</button>
    </div>
  </div>
</template>

<script setup>
import { themes } from '../model/themes.js'
defineProps({
  slide: Object,
  selectedBlock: Object,
  selectedShapeObj: Object
})
defineEmits(['setBgColor','setBg','setBlockStyle','setShapeProp','applyTheme'])
</script>

<style scoped>
.props-panel { padding: 12px; overflow-y: auto; font-size: 12px; }
.props-panel h3 { margin: 8px 0 4px; font-size: 13px; color: #555; }
.prop-group { display: flex; align-items: center; gap: 6px; margin: 4px 0; }
.prop-group label { min-width: 50px; color: #777; }
.prop-group input[type="color"] { width: 28px; height: 28px; border: none; cursor: pointer; }
.prop-group input[type="range"] { flex: 1; }
.prop-group select { flex: 1; padding: 3px; border: 1px solid #ddd; border-radius: 4px; }
.theme-btns { display: flex; flex-wrap: wrap; gap: 4px; }
.theme-btns button { padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; }
hr { border: none; border-top: 1px solid #eee; margin: 10px 0; }
</style>
