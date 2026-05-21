/**
 * Slide Document Model - AI Native 演示文档数据结构
 * 设计原则：模型友好(JSON直出) + token高效(最小diff) + 可编辑
 */

// 创建唯一ID
export function uid() {
  return 'b' + Math.random().toString(36).slice(2, 9)
}

// Block工厂
export function createBlock(type, content = '', style = {}) {
  const block = { id: uid(), type, content, style }
  if (type === 'image') { block.src = ''; block.caption = '' }
  if (type === 'cards') { block.cards = [] }
  return block
}

// Shape工厂
export function createShape(type, x = 100, y = 100, w = 120, h = 80) {
  return {
    id: 's' + Math.random().toString(36).slice(2, 9),
    type, x, y, w, h,
    fill: type === 'line' || type === 'arrow' ? 'none' : '#3b82f6',
    stroke: '#1e40af',
    strokeWidth: 2,
    opacity: 0.8,
    label: ''
  }
}

// 空白Slide工厂
export function createSlide(template = 'blank') {
  return {
    id: uid(),
    bg: '',
    bgColor: '#FFFFFF',
    blocks: [],
    shapes: []
  }
}
