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
.slide-list { display: flex; flex-direction: column; gap: 8px; padding: 10px; overflow-y: auto; }
.thumb { cursor: pointer; border-radius: 6px; border: 2px solid transparent; transition: all .15s; }
.thumb.active { border-color: #3b5fe0; box-shadow: 0 0 0 2px rgba(59,95,224,.2); }
.thumb:hover:not(.active) { border-color: #ddd; }
.thumb-inner { width: 100%; aspect-ratio: 16/9; border-radius: 4px; display: flex; align-items: flex-end; justify-content: flex-end; padding: 4px; }
.thumb-num { background: rgba(0,0,0,.5); color: #fff; font-size: 10px; padding: 1px 5px; border-radius: 3px; }
</style>
