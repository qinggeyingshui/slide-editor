<template>
  <div class="editor">
    <div class="toolbar">
      <div class="tb-group">
        <button @click="addSlide('blank')">+ 空白页</button>
        <button @click="addSlide('title')">+ 标题页</button>
        <button @click="addSlide('content')">+ 内容页</button>
        <button @click="addSlide('cards')">+ 卡片页</button>
      </div>
      <div class="tb-group">
        <button class="btn-cyan" @click="addBlock('heading')">H 标题</button>
        <button class="btn-cyan" @click="addBlock('text')">T 文本</button>
        <button class="btn-cyan" @click="addBlock('image')">🖼 图片</button>
        <button class="btn-cyan" @click="addBlock('cards')">▦ 卡片组</button>
        <button class="btn-cyan" @click="addBlock('list')">☰ 列表</button>
      </div>
      <div class="tb-group dropdown-wrap">
        <button class="btn-purple" @click="showShapes=!showShapes">⬡ 形状 ▾</button>
        <div class="dropdown-menu" v-show="showShapes">
          <button @click="addShape('rect');showShapes=false">▭ 矩形</button>
          <button @click="addShape('ellipse');showShapes=false">◯ 椭圆</button>
          <button @click="addShape('line');showShapes=false">╱ 线条</button>
          <button @click="addShape('arrow');showShapes=false">→ 箭头</button>
          <button @click="addShape('triangle');showShapes=false">△ 三角</button>
        </div>
      </div>
      <div class="tb-group">
        <button class="btn-yellow" @click="deleteBlock" :disabled="!selected && !selectedShape">✕ 删除</button>
        <button class="btn-green" @click="exportHTML">↓ 导出</button>
      </div>
    </div>
    <div class="main">
      <div class="slide-list">
        <div v-for="(s, i) in slides" :key="s.id" class="slide-thumb" :class="{active: currentSlide===i}" @click="currentSlide=i">
          <img v-if="s.bg" :src="s.bg" class="thumb-bg">
          <div class="thumb-overlay" :style="{background: s.bg ? 'none' : s.bgColor}">{{ i+1 }}</div>
          <button class="del-slide" @click.stop="deleteSlide(i)" v-if="slides.length>1">×</button>
        </div>
      </div>
      <div class="canvas-wrap" ref="wrapRef" @click="selected=null" @drop.prevent="onCanvasDrop" @dragover.prevent @paste="onPaste">
        <div class="canvas" :style="canvasStyle">
          <img v-if="currentData.bg" :src="currentData.bg" class="bg-img">
          <div class="content-layer" @click.stop>
            <div v-for="(block, i) in currentData.blocks" :key="block.id"
              class="block" :class="{selected: selected===block.id}"
              @click.stop="selectBlock(block.id)"
              draggable="true" @dragstart="dragStart(i)" @dragover.prevent @drop="drop(i)">
              <div class="block-handle">⋮⋮</div>
              <!-- heading -->
              <div v-if="block.type==='heading'" class="block-content heading"
                contenteditable @blur="onEdit($event,block)" :style="block.style" v-html="block.content"></div>
              <!-- text -->
              <div v-else-if="block.type==='text'" class="block-content"
                contenteditable @blur="onEdit($event,block)" :style="block.style" v-html="block.content"></div>
              <!-- list -->
              <div v-else-if="block.type==='list'" class="block-content list-block"
                contenteditable @blur="onEdit($event,block)" :style="block.style" v-html="block.content"></div>
              <!-- image -->
              <div v-else-if="block.type==='image'" class="img-block">
                <div v-if="block.src" class="img-resizable" :style="{width: block.style?.width || 'auto', maxWidth: block.style?.maxWidth || '80%', marginLeft: block.style?.marginLeft || '0', marginTop: block.style?.marginTop || '0', cursor: 'move'}" @mousedown="startDragImg($event, block)">
                  <img :src="block.src" style="width:100%;border-radius:6px;pointer-events:none" @dblclick="pickFile(block)">
                  <div class="resize-handle" @mousedown.stop.prevent="startResize($event, block)">⤡</div>
                </div>
                <div v-else class="img-placeholder" @click="pickFile(block)">
                  📷 点击选择图片 / 拖拽到此处 / Ctrl+V粘贴
                </div>
                <div class="img-tools" v-if="block.src">
                  <button @click="pickFile(block)">换图</button>
                  <button @click="promptUrl(block)">URL</button>
                </div>
                <input class="caption-input" v-model="block.caption" placeholder="图片说明...">
              </div>
              <!-- cards -->
              <div v-else-if="block.type==='cards'" class="cards-grid">
                <div v-for="(c,ci) in block.cards" :key="ci" class="card" :style="c.style"
                  contenteditable @blur="c.content=$event.target.innerText" v-text="c.content"></div>
                <div class="add-card" @click="block.cards.push({content:'新卡片',style:{background:randomColor()}})">+</div>
              </div>
            </div>
          </div>
          <!-- SVG Shape Layer -->
          <svg class="svg-layer" :viewBox="`0 0 1280 720`"
            @mousedown.self="selectedShape=null"
            @mousemove="onShapeMove" @mouseup="onShapeUp">
            <template v-for="shape in currentData.shapes" :key="shape.id">
              <!-- rect -->
              <rect v-if="shape.type==='rect'" :x="shape.x" :y="shape.y" :width="shape.w" :height="shape.h"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
                :class="{active: selectedShape===shape.id}" @mousedown.stop="startShapeDrag($event,shape)" />
              <!-- ellipse -->
              <ellipse v-else-if="shape.type==='ellipse'" :cx="shape.x+shape.w/2" :cy="shape.y+shape.h/2"
                :rx="shape.w/2" :ry="shape.h/2"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
                :class="{active: selectedShape===shape.id}" @mousedown.stop="startShapeDrag($event,shape)" />
              <!-- triangle -->
              <polygon v-else-if="shape.type==='triangle'"
                :points="`${shape.x+shape.w/2},${shape.y} ${shape.x},${shape.y+shape.h} ${shape.x+shape.w},${shape.y+shape.h}`"
                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
                :class="{active: selectedShape===shape.id}" @mousedown.stop="startShapeDrag($event,shape)" />
              <!-- line -->
              <line v-else-if="shape.type==='line'" :x1="shape.x" :y1="shape.y" :x2="shape.x+shape.w" :y2="shape.y+shape.h"
                :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
                :class="{active: selectedShape===shape.id}" @mousedown.stop="startShapeDrag($event,shape)" />
              <!-- arrow -->
              <g v-else-if="shape.type==='arrow'" :class="{active: selectedShape===shape.id}" @mousedown.stop="startShapeDrag($event,shape)">
                <defs><marker :id="'ah-'+shape.id" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" :fill="shape.stroke" /></marker></defs>
                <line :x1="shape.x" :y1="shape.y" :x2="shape.x+shape.w" :y2="shape.y+shape.h"
                  :stroke="shape.stroke" :stroke-width="shape.strokeWidth" :marker-end="`url(#ah-${shape.id})`" />
              </g>
            </template>
            <!-- resize handle for selected shape -->
            <rect v-if="activeShape && activeShape.type!=='line' && activeShape.type!=='arrow'"
              :x="activeShape.x+activeShape.w-6" :y="activeShape.y+activeShape.h-6" width="12" height="12"
              fill="#FF3DA5" rx="2" class="shape-resize-handle"
              @mousedown.stop="startShapeResize($event,activeShape)" />
          </svg>
        </div>
      </div>
      <!-- 属性面板 -->
      <div class="panel">
        <h3>主题风格</h3>
        <div class="theme-grid">
          <div v-for="(t, key) in THEMES" :key="key" class="theme-chip" :class="{active: currentTheme===key}"
            @click="applyTheme(key)" :title="t.name">
            <span class="theme-dot" :style="{background: t.ink}"></span>
            <span class="theme-dot" :style="{background: t.paper, border:'1px solid #ccc'}"></span>
            <span class="theme-dot" :style="{background: t.accent}"></span>
            <span class="theme-label">{{ t.emoji }} {{ t.name }}</span>
          </div>
        </div>
        <hr>
        <h3>页面设置</h3>
        <div class="prop-group">
          <label>背景色</label>
          <input type="color" :value="currentData.bgColor" @input="currentData.bgColor=$event.target.value">
        </div>
        <div class="prop-group">
          <label>背景图</label>
          <select @change="setTemplateBg($event.target.value)">
            <option value="">无</option>
            <option value="/assets/slide1_bg.png">标题版式</option>
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
            <input type="color" :value="selectedBlock.style?.color||'#1A1A2E'" @input="setStyle('color',$event.target.value)">
          </div>
          <div class="prop-group">
            <label>字号 {{ getStyle('fontSize','16px') }}</label>
            <input type="range" min="12" max="72" :value="parseInt(getStyle('fontSize','16px'))" @input="setStyle('fontSize',$event.target.value+'px')">
          </div>
          <div class="prop-group">
            <label>背景色</label>
            <input type="color" :value="selectedBlock.style?.background||'#ffffff'" @input="setStyle('background',$event.target.value)">
          </div>
          <div class="prop-group">
            <label>内边距</label>
            <input type="range" min="0" max="40" :value="parseInt(getStyle('padding','0'))" @input="setStyle('padding',$event.target.value+'px')">
          </div>
          <div class="prop-group">
            <label>圆角</label>
            <input type="range" min="0" max="24" :value="parseInt(getStyle('borderRadius','0'))" @input="setStyle('borderRadius',$event.target.value+'px')">
          </div>
          <div class="prop-group" v-if="selectedBlock.type==='image'">
            <label>图片宽度</label>
            <input type="range" min="20" max="100" :value="parseInt(getStyle('maxWidth','80'))" @input="setStyle('maxWidth',$event.target.value+'%')">
          </div>
        </template>
        <template v-else-if="activeShape">
          <h3>形状属性 ({{ activeShape.type }})</h3>
          <div class="prop-group">
            <label>填充色</label>
            <input type="color" :value="activeShape.fill||'#00B8D9'" @input="activeShape.fill=$event.target.value">
          </div>
          <div class="prop-group">
            <label>边框色</label>
            <input type="color" :value="activeShape.stroke||'#1A1A2E'" @input="activeShape.stroke=$event.target.value">
          </div>
          <div class="prop-group">
            <label>边框粗细 {{ activeShape.strokeWidth }}px</label>
            <input type="range" min="1" max="12" :value="activeShape.strokeWidth" @input="activeShape.strokeWidth=+$event.target.value">
          </div>
          <div class="prop-group">
            <label>X: {{ Math.round(activeShape.x) }}</label>
            <input type="range" min="0" max="1200" :value="activeShape.x" @input="activeShape.x=+$event.target.value">
          </div>
          <div class="prop-group">
            <label>Y: {{ Math.round(activeShape.y) }}</label>
            <input type="range" min="0" max="650" :value="activeShape.y" @input="activeShape.y=+$event.target.value">
          </div>
          <div class="prop-group">
            <label>宽: {{ Math.round(activeShape.w) }}</label>
            <input type="range" min="20" max="800" :value="activeShape.w" @input="activeShape.w=+$event.target.value">
          </div>
          <div class="prop-group">
            <label>高: {{ Math.round(activeShape.h) }}</label>
            <input type="range" min="20" max="600" :value="activeShape.h" @input="activeShape.h=+$event.target.value">
          </div>
        </template>
        <template v-else>
          <p class="hint">点击画布中的块或形状编辑属性</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6)
const palette = ['#FF3DA5','#FFD93D','#00B8D9','#00C896','#FF6B4A','#5C5C7A']
const randomColor = () => palette[Math.floor(Math.random()*palette.length)]

// 主题系统 (参考 guizang-ppt-skill)
const THEMES = {
  default: { name: '默认', emoji: '🎨', ink: '#1A1A2E', paper: '#FFF8EE', paperTint: '#f5f0e8', inkTint: '#5C5C7A', accent: '#FF3DA5', accent2: '#00B8D9', accent3: '#FFD93D' },
  inkClassic: { name: '墨水经典', emoji: '🖋', ink: '#0a0a0b', paper: '#f1efea', paperTint: '#e8e4dd', inkTint: '#3a3a3c', accent: '#c62828', accent2: '#1565c0', accent3: '#f9a825' },
  indigoPorcelain: { name: '靛蓝瓷', emoji: '🌊', ink: '#0a1f3d', paper: '#f1f3f5', paperTint: '#e3e8ed', inkTint: '#4a6080', accent: '#1976d2', accent2: '#00838f', accent3: '#ffb300' },
  forestInk: { name: '森林墨', emoji: '🌲', ink: '#1a2e1f', paper: '#f5f1e8', paperTint: '#e8e2d6', inkTint: '#4a6050', accent: '#2e7d32', accent2: '#00695c', accent3: '#f57f17' },
  kraft: { name: '牛皮纸', emoji: '📜', ink: '#2a1e13', paper: '#eedfc7', paperTint: '#e2d4b5', inkTint: '#6d5540', accent: '#bf360c', accent2: '#4e342e', accent3: '#ff8f00' },
  dune: { name: '沙丘', emoji: '🏜', ink: '#1f1a14', paper: '#f0e6d2', paperTint: '#e4d9c4', inkTint: '#6b5d4f', accent: '#e65100', accent2: '#795548', accent3: '#fbc02d' }
}

const currentTheme = ref('default')

function applyTheme(themeKey) {
  const theme = THEMES[themeKey]
  if (!theme) return
  currentTheme.value = themeKey
  slides.forEach(slide => {
    // 深色背景slide(title页) → ink作为bgColor, paper作为文字色
    const isDark = slide.bgColor && isColorDark(slide.bgColor)
    slide.bgColor = isDark ? theme.ink : theme.paper
    slide.blocks.forEach(block => {
      if (block.style?.color) {
        block.style.color = isDark ? theme.paper : theme.ink
      }
      if (block.type === 'cards' && block.cards) {
        const accents = [theme.accent, theme.accent2, theme.accent3]
        block.cards.forEach((c, i) => {
          if (c.style?.background) c.style.background = accents[i % 3]
        })
      }
    })
  })
}

function isColorDark(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substr(0,2),16), g = parseInt(c.substr(2,2),16), b = parseInt(c.substr(4,2),16)
  return (r*299 + g*587 + b*114) / 1000 < 128
}

const canvasScale = ref(1)
const wrapRef = ref(null)

const TEMPLATES = {
  blank: { bg: '', bgColor: '#FFF8EE', blocks: [] },
  title: { bg: '/assets/slide1_bg.png', bgColor: '#1A1A2E', blocks: [
    { type: 'heading', content: '演示标题', style: { color: '#FFF8EE', fontSize: '48px', textAlign: 'center', marginTop: '160px' } },
    { type: 'text', content: '副标题 / 作者', style: { color: '#FFD93D', fontSize: '20px', textAlign: 'center' } }
  ]},
  content: { bg: '/assets/slide2_bg.png', bgColor: '#FFF8EE', blocks: [
    { type: 'heading', content: '章节标题', style: { color: '#1A1A2E', fontSize: '32px' } },
    { type: 'text', content: '在这里输入内容...', style: { fontSize: '18px', color: '#333' } }
  ]},
  cards: { bg: '/assets/slide5_bg.png', bgColor: '#FFF8EE', blocks: [
    { type: 'heading', content: '数据概览', style: { color: '#1A1A2E', fontSize: '28px' } },
    { type: 'cards', cards: [
      { content: '指标 A', style: { background: '#FF3DA5' } },
      { content: '指标 B', style: { background: '#00B8D9' } },
      { content: '指标 C', style: { background: '#FFD93D', color: '#1A1A2E' } }
    ], style: {} }
  ]}
}

function createSlide(tpl) {
  const t = TEMPLATES[tpl] || TEMPLATES.blank
  return { id: uid(), bg: t.bg, bgColor: t.bgColor, blocks: t.blocks.map(b => ({...b, id: uid(), style: {...b.style}, cards: b.cards?.map(c=>({...c,style:{...c.style}}))})) }
}

const davinciData = [
  { bg: '/assets/slide1_bg.png', bgColor: '#1A1A2E', blocks: [
    { type: 'heading', content: '列奥纳多·达芬奇', style: { fontSize: '42px', color: '#FFF8EE', fontWeight: 'bold' } },
    { type: 'text', content: 'Leonardo da Vinci (1452–1519)', style: { fontSize: '22px', color: '#FFD93D' } },
    { type: 'text', content: '文艺复兴的全才 — 画家·科学家·发明家·工程师', style: { fontSize: '18px', color: '#FFF8EE' } }
  ]},
  { bg: '/assets/slide2_bg.png', bgColor: '#FFF8EE', blocks: [
    { type: 'heading', content: '生平概述', style: { fontSize: '28px', color: '#1A1A2E', fontWeight: 'bold' } },
    { type: 'text', content: '<b style="color:#FF3DA5">1452</b> 出生于意大利佛罗伦萨附近的芬奇镇<br><b style="color:#FF3DA5">1466</b> 进入韦罗基奥工作室学习绘画与雕塑<br><b style="color:#FF3DA5">1482</b> 移居米兰，为卢多维科·斯福尔扎服务<br><b style="color:#FF3DA5">1495</b> 开始创作《最后的晚餐》壁画<br><b style="color:#FF3DA5">1503</b> 开始绘制《蒙娜丽莎》<br><b style="color:#FF3DA5">1516</b> 受法王弗朗索瓦一世邀请移居法国<br><b style="color:#FF3DA5">1519</b> 于法国昂布瓦斯逝世，享年67岁', style: { fontSize: '16px', color: '#333', lineHeight: '2' } }
  ]},
  { bg: '/assets/slide5_bg.png', bgColor: '#FFF8EE', blocks: [
    { type: 'heading', content: '绘画成就', style: { fontSize: '28px', color: '#1A1A2E', fontWeight: 'bold' } },
    { type: 'cards', cards: [
      { content: '<b>🎨 蒙娜丽莎</b><br>世界最著名肖像画，运用"晕涂法"营造神秘微笑', style: { background: '#FF3DA5', color: '#fff' } },
      { content: '<b>🍷 最后的晚餐</b><br>米兰圣母感恩教堂壁画(4.6m×8.8m)，透视法经典', style: { background: '#00B8D9', color: '#fff' } },
      { content: '<b>👤 维特鲁威人</b><br>人体比例研究标志性素描，人体与几何的完美关系', style: { background: '#00C896', color: '#fff' } }
    ], style: {} }
  ]},
  { bg: '/assets/slide2_bg.png', bgColor: '#FFF8EE', blocks: [
    { type: 'heading', content: '革命性绘画技法', style: { fontSize: '28px', color: '#1A1A2E', fontWeight: 'bold' } },
    { type: 'text', content: '<table style="width:100%;border-collapse:collapse;font-size:14px"><tr style="background:#1A1A2E;color:#FFF8EE"><th style="padding:8px">技法</th><th style="padding:8px">说明</th></tr><tr style="background:#f0f8ff"><td style="padding:8px"><b>晕涂法 Sfumato</b></td><td style="padding:8px">多层半透明颜料，消除轮廓线</td></tr><tr><td style="padding:8px"><b>明暗法 Chiaroscuro</b></td><td style="padding:8px">强烈光影对比营造立体感</td></tr><tr style="background:#f0f8ff"><td style="padding:8px"><b>空气透视法</b></td><td style="padding:8px">远景偏蓝模糊，近景清晰鲜明</td></tr><tr><td style="padding:8px"><b>解剖学精确</b></td><td style="padding:8px">基于30+具尸体解剖的人体结构研究</td></tr><tr style="background:#f0f8ff"><td style="padding:8px"><b>构图几何</b></td><td style="padding:8px">金字塔/螺旋构图引导视线</td></tr></table>', style: { fontSize: '14px' } }
  ]},
  { bg: '/assets/slide5_bg.png', bgColor: '#FFF8EE', blocks: [
    { type: 'heading', content: '科学研究领域', style: { fontSize: '28px', color: '#1A1A2E', fontWeight: 'bold' } },
    { type: 'cards', cards: [
      { content: '<b>🫀 解剖学</b><br>绘制超750幅解剖图，发现动脉硬化', style: { background: '#FF3DA5', color: '#fff' } },
      { content: '<b>🌊 流体力学</b><br>研究水流漩涡，绘制精确湍流图', style: { background: '#FFD93D', color: '#1A1A2E' } },
      { content: '<b>🌿 植物学</b><br>发现年轮与气候关系，叶序规律', style: { background: '#00B8D9', color: '#fff' } },
      { content: '<b>🪨 地质学</b><br>正确解释山中化石为远古海洋遗迹', style: { background: '#00C896', color: '#fff' } }
    ], style: {} }
  ]},
  { bg: '/assets/slide8_bg.png', bgColor: '#1A1A2E', blocks: [
    { type: 'heading', content: '超前时代的发明设计', style: { fontSize: '28px', color: '#FFF8EE', fontWeight: 'bold' } },
    { type: 'cards', cards: [
      { content: '<b>✈️ 飞行器</b><br>扑翼机/螺旋桨/降落伞设计', style: { background: '#FF3DA5', color: '#fff' } },
      { content: '<b>⚔️ 军事</b><br>装甲车/机关枪/巨型弩设计', style: { background: '#FFD93D', color: '#1A1A2E' } },
      { content: '<b>🌉 土木</b><br>旋转桥/自支撑拱桥/理想城市', style: { background: '#00B8D9', color: '#fff' } },
      { content: '<b>⚙️ 机械</b><br>自动化纺织机/滚珠轴承/齿轮组', style: { background: '#00C896', color: '#fff' } }
    ], style: {} }
  ]},
  { bg: '/assets/slide2_bg.png', bgColor: '#FFF8EE', blocks: [
    { type: 'heading', content: '传世手稿与笔记', style: { fontSize: '28px', color: '#1A1A2E', fontWeight: 'bold' } },
    { type: 'text', content: '<table style="width:100%;border-collapse:collapse;font-size:14px"><tr style="background:#1A1A2E;color:#FFF8EE"><th style="padding:8px">手稿</th><th style="padding:8px">内容</th><th style="padding:8px">现藏</th></tr><tr style="background:#f0f8ff"><td style="padding:8px">大西洋古抄本</td><td style="padding:8px">机械/数学/天文</td><td style="padding:8px">米兰</td></tr><tr><td style="padding:8px">温莎手稿</td><td style="padding:8px">解剖学/自然研究</td><td style="padding:8px">英国王室</td></tr><tr style="background:#f0f8ff"><td style="padding:8px">阿伦德尔手稿</td><td style="padding:8px">物理/力学</td><td style="padding:8px">大英图书馆</td></tr><tr><td style="padding:8px">莱斯特手稿</td><td style="padding:8px">水文/地质/天文</td><td style="padding:8px">比尔·盖茨</td></tr><tr style="background:#f0f8ff"><td style="padding:8px">鸟类飞行手稿</td><td style="padding:8px">飞行原理/空气动力学</td><td style="padding:8px">都灵</td></tr></table><p style="margin-top:8px;color:#5C5C7A;font-size:13px">现存约7200页手稿，全部使用镜像文字书写</p>', style: {} }
  ]},
  { bg: '/assets/slide5_bg.png', bgColor: '#FFF8EE', blocks: [
    { type: 'heading', content: '工作方法与思维特质', style: { fontSize: '28px', color: '#1A1A2E', fontWeight: 'bold' } },
    { type: 'cards', cards: [
      { content: '<b>👁️ 极致观察</b><br>"先学会观察，再学会画画"——从自然中提取规律', style: { background: '#FF3DA5', color: '#fff' } },
      { content: '<b>🔗 跨学科融合</b><br>艺术与科学不分家，解剖学服务于绘画，几何服务于工程', style: { background: '#00B8D9', color: '#fff' } },
      { content: '<b>🧪 实验验证</b><br>不信权威，亲自解剖、测量、实验，用数据说话', style: { background: '#00C896', color: '#fff' } }
    ], style: {} }
  ]},
  { bg: '/assets/slide11_bg.png', bgColor: '#1A1A2E', blocks: [
    { type: 'heading', content: '历史影响与遗产', style: { fontSize: '28px', color: '#FFF8EE', fontWeight: 'bold' } },
    { type: 'list', content: '<ul><li>定义了"文艺复兴人"(Renaissance Man)的概念</li><li>《蒙娜丽莎》年参观量超1000万人次</li><li>解剖学研究领先医学界300年</li><li>飞行器设计启发现代航空工程</li><li>《救世主》2017年拍出4.503亿美元(史上最贵画作)</li><li>NASA火星探测器以其名字命名</li><li>全球超50座博物馆收藏其作品或手稿</li></ul>', style: { fontSize: '16px', color: '#FFF8EE', lineHeight: '1.8' } }
  ]},
  { bg: '/assets/slide14_bg.png', bgColor: '#1A1A2E', blocks: [
    { type: 'heading', content: '"学习永远不会耗尽心灵"', style: { fontSize: '32px', color: '#FFD93D', fontWeight: 'bold', textAlign: 'center' } },
    { type: 'text', content: 'Learning never exhausts the mind.<br>— Leonardo da Vinci', style: { fontSize: '20px', color: '#FFF8EE', textAlign: 'center' } },
    { type: 'text', content: '感谢观看 · Grazie', style: { fontSize: '18px', color: '#FF3DA5', textAlign: 'center' } }
  ]}
]

const slides = reactive(davinciData.map(s => ({
  id: uid(), bg: s.bg, bgColor: s.bgColor, shapes: [],
  blocks: s.blocks.map(b => ({ ...b, id: uid(), style: { ...b.style }, cards: b.cards?.map(c => ({ ...c, style: { ...c.style } })) }))
})))
const currentSlide = ref(0)
const selected = ref(null)
const selectedShape = ref(null)
const showShapes = ref(false)
const dragIdx = ref(null)
const shapeDrag = ref(null) // {id, startX, startY, origX, origY}
const shapeResize = ref(null)

const currentData = computed(() => slides[currentSlide.value])
const selectedBlock = computed(() => currentData.value?.blocks.find(b => b.id === selected.value))
const activeShape = computed(() => currentData.value?.shapes?.find(s => s.id === selectedShape.value))
const canvasStyle = computed(() => ({ background: currentData.value?.bgColor || '#FFF8EE', transform: `scale(${canvasScale.value})` }))

onMounted(() => {
  const ro = new ResizeObserver(() => {
    if (!wrapRef.value) return
    const { clientWidth: w, clientHeight: h } = wrapRef.value
    canvasScale.value = Math.min((w - 20) / 1280, (h - 20) / 720)
  })
  ro.observe(wrapRef.value)
  onUnmounted(() => ro.disconnect())
})

function selectBlock(id) { selected.value = id }
function addSlide(tpl) { slides.push(createSlide(tpl)); currentSlide.value = slides.length - 1 }
function deleteSlide(i) { if (slides.length > 1) { slides.splice(i, 1); currentSlide.value = Math.min(currentSlide.value, slides.length-1) } }

function addBlock(type) {
  const b = { id: uid(), type, style: {} }
  if (type === 'heading') { b.content = '新标题'; b.style = { fontSize: '28px', color: '#1A1A2E', fontWeight: 'bold' } }
  else if (type === 'text') { b.content = '新文本块'; b.style = { fontSize: '16px', color: '#333' } }
  else if (type === 'list') { b.content = '<ul><li>项目一</li><li>项目二</li><li>项目三</li></ul>'; b.style = { fontSize: '16px' } }
  else if (type === 'image') { b.src = ''; b.caption = ''; b.style = { maxWidth: '80%' } }
  else if (type === 'cards') { b.cards = [{content:'卡片1',style:{background:'#FF3DA5'}},{content:'卡片2',style:{background:'#00B8D9'}},{content:'卡片3',style:{background:'#00C896'}}]; b.style = {} }
  currentData.value.blocks.push(b)
  selected.value = b.id
  if (type === 'image') pickFile(b, true)
}

function insertImageFromFile(file) {
  const reader = new FileReader()
  reader.onload = ev => {
    const b = { id: uid(), type: 'image', src: ev.target.result, caption: file.name.replace(/\.[^.]+$/,''), style: { maxWidth: '80%' } }
    currentData.value.blocks.push(b)
    selected.value = b.id
  }
  reader.readAsDataURL(file)
}

function onCanvasDrop(e) {
  e.preventDefault()
  const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'))
  files.forEach(insertImageFromFile)
}

function onPaste(e) {
  const items = [...(e.clipboardData?.items || [])]
  const imgItem = items.find(i => i.type.startsWith('image/'))
  if (imgItem) { e.preventDefault(); insertImageFromFile(imgItem.getAsFile()) }
}

function deleteBlock() {
  if (selectedShape.value) {
    const idx = currentData.value.shapes.findIndex(s => s.id === selectedShape.value)
    if (idx >= 0) currentData.value.shapes.splice(idx, 1)
    selectedShape.value = null
    return
  }
  if (!selected.value) return
  const idx = currentData.value.blocks.findIndex(b => b.id === selected.value)
  if (idx >= 0) currentData.value.blocks.splice(idx, 1)
  selected.value = null
}

function addShape(type) {
  if (!currentData.value.shapes) currentData.value.shapes = []
  const s = { id: uid(), type, x: 100, y: 100, w: 160, h: 100, fill: 'rgba(0,184,217,0.3)', stroke: '#00B8D9', strokeWidth: 2 }
  if (type === 'line' || type === 'arrow') { s.fill = 'none'; s.w = 200; s.h = 0 }
  currentData.value.shapes.push(s)
  selectedShape.value = s.id
  selected.value = null
}

function startShapeDrag(e, shape) {
  selectedShape.value = shape.id
  selected.value = null
  const svg = e.target.closest('svg')
  const pt = svg.createSVGPoint()
  pt.x = e.clientX; pt.y = e.clientY
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
  shapeDrag.value = { id: shape.id, startX: svgP.x, startY: svgP.y, origX: shape.x, origY: shape.y }
}

function onShapeMove(e) {
  if (!shapeDrag.value && !shapeResize.value) return
  const svg = e.target.closest('svg') || e.currentTarget
  const pt = svg.createSVGPoint()
  pt.x = e.clientX; pt.y = e.clientY
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
  if (shapeDrag.value) {
    const shape = currentData.value.shapes.find(s => s.id === shapeDrag.value.id)
    if (shape) {
      shape.x = shapeDrag.value.origX + (svgP.x - shapeDrag.value.startX)
      shape.y = shapeDrag.value.origY + (svgP.y - shapeDrag.value.startY)
    }
  }
  if (shapeResize.value) {
    const shape = currentData.value.shapes.find(s => s.id === shapeResize.value.id)
    if (shape) {
      shape.w = Math.max(20, shapeResize.value.origW + (svgP.x - shapeResize.value.startX))
      shape.h = Math.max(20, shapeResize.value.origH + (svgP.y - shapeResize.value.startY))
    }
  }
}

function onShapeUp() { shapeDrag.value = null; shapeResize.value = null }

function startShapeResize(e, shape) {
  const svg = e.target.closest('svg')
  const pt = svg.createSVGPoint()
  pt.x = e.clientX; pt.y = e.clientY
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
  shapeResize.value = { id: shape.id, startX: svgP.x, startY: svgP.y, origW: shape.w, origH: shape.h }
}

function onEdit(e, block) { block.content = e.target.innerHTML }
function dragStart(i) { dragIdx.value = i }
function drop(i) {
  const blocks = currentData.value.blocks
  const [item] = blocks.splice(dragIdx.value, 1)
  blocks.splice(i, 0, item)
  dragIdx.value = null
}

function getStyle(prop, def) { return selectedBlock.value?.style?.[prop] || def }
function setStyle(prop, val) {
  if (!selectedBlock.value) return
  if (!selectedBlock.value.style) selectedBlock.value.style = {}
  selectedBlock.value.style[prop] = val
}

function pickFile(block, removeOnCancel) {
  const input = document.createElement('input')
  input.type = 'file'; input.accept = 'image/*'
  input.onchange = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => { block.src = ev.target.result }
      reader.readAsDataURL(file)
    } else if (removeOnCancel) {
      const idx = currentData.value.blocks.findIndex(b => b.id === block.id)
      if (idx >= 0) currentData.value.blocks.splice(idx, 1)
    }
  }
  input.click()
}

function promptUrl(block) {
  const url = prompt('输入图片URL:')
  if (url) block.src = url
}

function startResize(e, block) {
  e.stopPropagation()
  const startX = e.clientX
  const el = e.target.parentElement
  const startW = el.offsetWidth
  const onMove = ev => {
    const w = Math.max(60, startW + ev.clientX - startX)
    if (!block.style) block.style = {}
    block.style.width = w + 'px'
    block.style.maxWidth = w + 'px'
  }
  const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function startDragImg(e, block) {
  if (e.target.classList.contains('resize-handle')) return
  e.preventDefault()
  const startX = e.clientX, startY = e.clientY
  const ox = parseInt(block.style?.marginLeft) || 0
  const oy = parseInt(block.style?.marginTop) || 0
  const onMove = ev => {
    if (!block.style) block.style = {}
    block.style.marginLeft = (ox + ev.clientX - startX) + 'px'
    block.style.marginTop = (oy + ev.clientY - startY) + 'px'
  }
  const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function setTemplateBg(val) {
  if (val === 'custom') { changeSlideBg(); return }
  currentData.value.bg = val
}
function changeSlideBg() {
  const input = document.createElement('input')
  input.type = 'file'; input.accept = 'image/*'
  input.onchange = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => { currentData.value.bg = ev.target.result }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

function exportHTML() {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
.slide{width:960px;height:540px;margin:20px auto;position:relative;overflow:hidden;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.15);page-break-after:always}
.slide .bg-img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
.slide .content{position:relative;padding:40px;height:100%;display:flex;flex-direction:column;gap:12px}
.cards-grid{display:flex;gap:12px;flex-wrap:wrap}
.card{padding:16px;border-radius:8px;flex:1;min-width:120px;color:white;font-weight:500}
img{max-width:100%;display:block;margin:0 auto}
.caption{font-size:12px;color:#5C5C7A;text-align:center;margin-top:4px}
</style></head><body>\n`
  slides.forEach(slide => {
    html += `<div class="slide" style="background:${slide.bgColor||'#FFF8EE'}">\n`
    if (slide.bg) html += `  <img class="bg-img" src="${slide.bg}">\n`
    html += `  <div class="content">\n`
    slide.blocks.forEach(b => {
      const s = Object.entries(b.style||{}).map(([k,v])=>`${k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())}:${v}`).join(';')
      if (b.type==='heading') html += `    <h2 style="${s}">${b.content}</h2>\n`
      else if (b.type==='text'||b.type==='list') html += `    <div style="${s}">${b.content}</div>\n`
      else if (b.type==='image') html += `    <div style="text-align:center"><img src="${b.src}" style="${s}"><p class="caption">${b.caption||''}</p></div>\n`
      else if (b.type==='cards') {
        html += `    <div class="cards-grid">\n`
        b.cards.forEach(c => { html += `      <div class="card" style="${Object.entries(c.style||{}).map(([k,v])=>`${k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())}:${v}`).join(';')}">${c.content}</div>\n` })
        html += `    </div>\n`
      }
    })
    html += `  </div>\n</div>\n`
  })
  html += '</body></html>'
  const blob = new Blob([html], {type:'text/html'})
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'presentation.html'; a.click()
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f2f3f5; }
.editor { height: 100vh; display: flex; flex-direction: column; }
.toolbar { background: #fff; padding: 8px 20px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; border-bottom: 1px solid #e5e7eb; }
.tb-group { display: flex; gap: 4px; }
.dropdown-wrap { position: relative; }
.dropdown-menu { position: absolute; top: 100%; left: 0; margin-top: 4px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.1); padding: 4px; z-index: 100; display: flex; flex-direction: column; gap: 2px; min-width: 100px; }
.dropdown-menu button { text-align: left; }
.toolbar button { background: #f0f1f3; color: #374151; border: 1px solid #e5e7eb; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; white-space: nowrap; transition: all .15s; }
.toolbar button:hover { background: #e0e7ff; border-color: #3b5fe0; color: #3b5fe0; }
.toolbar button:disabled { background: #f9fafb; color: #9ca3af; cursor: not-allowed; border-color: #e5e7eb; }
.toolbar .btn-cyan { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.toolbar .btn-cyan:hover { background: #dbeafe; }
.toolbar .btn-yellow { background: #fef3c7; color: #d97706; border-color: #fde68a; }
.toolbar .btn-yellow:hover { background: #fde68a; }
.toolbar .btn-green { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
.toolbar .btn-green:hover { background: #d1fae5; }
.toolbar .btn-purple { background: #f3e8ff; color: #7c3aed; border-color: #ddd6fe; }
.toolbar .btn-purple:hover { background: #ede9fe; }
.main { flex: 1; display: flex; overflow: hidden; }
.slide-list { width: 160px; background: #fff; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; border-right: 1px solid #e5e7eb; }
.slide-thumb { background: #f9fafb; border-radius: 6px; aspect-ratio: 16/9; position: relative; cursor: pointer; overflow: hidden; border: 2px solid #e5e7eb; transition: border-color .15s; }
.slide-thumb:hover { border-color: #93c5fd; }
.slide-thumb.active { border-color: #3b5fe0; box-shadow: 0 0 0 2px rgba(59,95,224,.15); }
.thumb-bg { position: absolute; width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
.thumb-overlay { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #374151; position: relative; font-size: 16px; }
.del-slide { position: absolute; top: 2px; right: 4px; background: rgba(0,0,0,.4); border: none; color: #fff; font-size: 12px; cursor: pointer; border-radius: 50%; width: 16px; height: 16px; line-height: 16px; opacity: 0; transition: opacity .2s; }
.slide-thumb:hover .del-slide { opacity: 1; }
.canvas-wrap { flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 10px; background: #eef0f4; }
.canvas { width: 1280px; height: 720px; border-radius: 8px; position: relative; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,.08); transform-origin: center; background: #fff; }
.bg-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
.content-layer { position: relative; height: 100%; padding: 32px 40px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; z-index: 1; }
.block { position: relative; border: 2px solid transparent; border-radius: 6px; transition: border-color .15s; display: flex; align-items: flex-start; }
.block:hover { border-color: rgba(59,95,224,.3); }
.block.selected { border-color: #3b5fe0; box-shadow: 0 0 0 2px rgba(59,95,224,.12); }
.block-handle { cursor: grab; padding: 4px; color: #9ca3af; user-select: none; font-size: 12px; }
.block-content { flex: 1; outline: none; min-height: 24px; word-break: break-word; }
.block-content.heading { font-weight: bold; }
.block-content[contenteditable]:focus { background: rgba(59,95,224,.04); border-radius: 4px; }
.list-block ul, .list-block ol { padding-left: 20px; }
.img-block { text-align: center; position: relative; flex: 1; }
.img-resizable { position: relative; display: inline-block; }
.img-resizable img { display: block; }
.resize-handle { position: absolute; bottom: 2px; right: 2px; width: 18px; height: 18px; background: #3b5fe0; color: #fff; border-radius: 4px; cursor: nwse-resize; display: flex; align-items: center; justify-content: center; font-size: 11px; opacity: 0; transition: opacity .2s; user-select: none; }
.img-resizable:hover .resize-handle { opacity: 1; }
.img-block img { max-width: 80%; border-radius: 6px; }
.img-placeholder { width: 200px; height: 120px; margin: 0 auto; background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af; cursor: pointer; }
.img-tools { position: absolute; top: 4px; right: 4px; display: flex; gap: 4px; opacity: 0; transition: opacity .2s; }
.img-block:hover .img-tools { opacity: 1; }
.img-tools button { background: #fef3c7; border: none; border-radius: 4px; padding: 2px 8px; font-size: 11px; cursor: pointer; }
.caption-input { border: none; background: transparent; text-align: center; width: 100%; font-size: 12px; color: #6b7280; margin-top: 4px; outline: none; }
.cards-grid { display: flex; gap: 10px; flex-wrap: wrap; flex: 1; }
.card { padding: 14px; border-radius: 8px; flex: 1; min-width: 100px; color: white; font-weight: 500; outline: none; }
.add-card { background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; padding: 14px; cursor: pointer; min-width: 60px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 20px; }
.panel { width: 300px; background: #fff; padding: 16px; overflow-y: auto; color: #374151; border-left: 1px solid #e5e7eb; }
.panel h3 { margin-bottom: 12px; color: #3b5fe0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
.panel label { font-size: 12px; color: #6b7280; display: block; margin-bottom: 4px; }
.prop-group { margin-bottom: 12px; }
.prop-group input[type="color"] { width: 100%; height: 28px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer; }
.prop-group input[type="range"] { width: 100%; accent-color: #3b5fe0; }
.prop-group select { width: 100%; padding: 4px 8px; border-radius: 6px; background: #f9fafb; color: #374151; border: 1px solid #e5e7eb; }
.panel hr { border: none; border-top: 1px solid #e5e7eb; margin: 12px 0; }
.theme-grid { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
.theme-chip { display: flex; align-items: center; gap: 4px; padding: 6px 8px; border-radius: 6px; cursor: pointer; background: #f9fafb; border: 2px solid transparent; transition: all .2s; }
.theme-chip:hover { border-color: #93c5fd; background: #eff6ff; }
.theme-chip.active { border-color: #3b5fe0; background: #eff6ff; }
.theme-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
.theme-label { font-size: 11px; color: #6b7280; margin-left: 4px; }
.hint { font-size: 12px; color: #9ca3af; }
.svg-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }
.svg-layer rect, .svg-layer ellipse, .svg-layer polygon, .svg-layer line, .svg-layer g { cursor: move; pointer-events: all; }
.svg-layer .active { filter: drop-shadow(0 0 4px #3b5fe0); }
.shape-resize-handle { cursor: nwse-resize; }
</style>
