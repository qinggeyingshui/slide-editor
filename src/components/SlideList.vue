<template>
  <div class="slide-list">
    <div v-for="(slide, i) in slides" :key="slide.id"
      class="thumb" :class="{active: i === currentIndex}"
      @click="$emit('select', i)">
      <div class="thumb-inner" :style="{
        backgroundColor: slide.bgColor || '#fff',
        backgroundImage: slide.bg ? `url(${slide.bg})` : 'none',
        backgroundSize: 'cover'
      }">
        <span class="thumb-num">{{ i + 1 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  slides: Array,
  currentIndex: Number
})
defineEmits(['select'])
</script>

<style scoped>
.slide-list {
  display: flex; flex-direction: column; gap: 12px;
  padding: 16px; overflow-y: auto;
}
.slide-list::-webkit-scrollbar { width: 4px; }
.slide-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
.thumb {
  cursor: pointer; border-radius: var(--radius-md);
  border: 2px solid transparent; padding: 6px;
  transition: all var(--transition-fast);
}
.thumb:hover:not(.active) {
  border-color: var(--color-border-hover);
  background: var(--color-surface-alt);
}
.thumb.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.thumb-inner {
  width: 100%; aspect-ratio: 16/9;
  border-radius: var(--radius-sm);
  display: flex; align-items: flex-end; justify-content: flex-end;
  padding: 6px; position: relative;
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: box-shadow var(--transition-fast);
}
.thumb:hover .thumb-inner { box-shadow: var(--shadow-sm); }
.thumb-num {
  background: rgba(15, 23, 42, 0.6); color: #fff;
  font-size: 10px; font-weight: 600; padding: 2px 6px;
  border-radius: 4px; backdrop-filter: blur(4px);
}
</style>
