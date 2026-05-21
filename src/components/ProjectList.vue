<template>
  <div class="project-list">
    <div class="pl-header">
      <h1>📑 我的演示文稿</h1>
      <p class="pl-subtitle">选择一个项目开始编辑，或创建新项目</p>
    </div>
    <div class="pl-grid">
      <div class="pl-card pl-card-new" @click="$emit('create')">
        <div class="pl-card-icon">+</div>
        <div class="pl-card-title">新建空白</div>
      </div>
      <div
        v-for="proj in projects"
        :key="proj.id"
        class="pl-card"
        @click="$emit('open', proj.id)"
      >
        <div class="pl-card-preview" v-html="getPreview(proj)"></div>
        <div class="pl-card-info">
          <div class="pl-card-title">{{ proj.title }}</div>
          <div class="pl-card-meta">{{ proj.slideCount }}页 · {{ formatTime(proj.updatedAt) }}</div>
        </div>
        <button class="pl-card-del" @click.stop="$emit('delete', proj.id)" title="删除">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ projects: Array })
defineEmits(['open', 'create', 'delete'])

function getPreview(proj) {
  const key = `slide-editor-data-${proj.id}`
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    if (data[0] && data[0].innerHTML) {
      return `<div style="transform:scale(0.18);transform-origin:top left;width:1280px;height:720px;overflow:hidden;pointer-events:none;">${data[0].innerHTML}</div>`
    }
  } catch(e) {}
  return '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:14px;">空</div>'
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff/60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff/3600000) + '小时前'
  return d.toLocaleDateString('zh-CN')
}
</script>


<style scoped>
.project-list { padding: 60px 40px; max-width: 1200px; margin: 0 auto; min-height: 100vh; background: #f8fafc; }
.pl-header { margin-bottom: 40px; }
.pl-header h1 { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0 0 8px; }
.pl-subtitle { color: #64748b; font-size: 15px; margin: 0; }
.pl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
.pl-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; cursor: pointer; overflow: hidden; transition: all .2s; position: relative; }
.pl-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); transform: translateY(-2px); }
.pl-card-new { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; border: 2px dashed #cbd5e1; background: transparent; }
.pl-card-new:hover { border-color: #3b82f6; background: #eff6ff; }
.pl-card-icon { font-size: 48px; color: #94a3b8; line-height: 1; }
.pl-card-new:hover .pl-card-icon { color: #3b82f6; }
.pl-card-preview { height: 150px; overflow: hidden; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; }
.pl-card-info { padding: 14px 16px; }
.pl-card-title { font-size: 15px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pl-card-meta { font-size: 12px; color: #94a3b8; margin-top: 4px; }
.pl-card-del { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; border: none; background: rgba(0,0,0,.05); color: #64748b; font-size: 18px; cursor: pointer; display: none; align-items: center; justify-content: center; }
.pl-card:hover .pl-card-del { display: flex; }
.pl-card-del:hover { background: #fee2e2; color: #ef4444; }
</style>
