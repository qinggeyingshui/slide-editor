<template>
  <svg class="shape-layer" @mousemove="$emit('shapemove', $event)" @mouseup="$emit('shapeup')"
    @click.self="$emit('clearselection')">
    <template v-for="shape in shapes" :key="shape.id">
      <!-- rect -->
      <rect v-if="shape.type==='rect'" :x="shape.x" :y="shape.y" :width="shape.w" :height="shape.h"
        :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth" :opacity="shape.opacity"
        :class="{'shape-selected': selectedShape===shape.id}"
        @mousedown="$emit('shapedrag', $event, shape)" />
      <!-- ellipse -->
      <ellipse v-else-if="shape.type==='ellipse'" :cx="shape.x+shape.w/2" :cy="shape.y+shape.h/2"
        :rx="shape.w/2" :ry="shape.h/2"
        :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth" :opacity="shape.opacity"
        :class="{'shape-selected': selectedShape===shape.id}"
        @mousedown="$emit('shapedrag', $event, shape)" />
      <!-- line -->
      <line v-else-if="shape.type==='line'" :x1="shape.x" :y1="shape.y" :x2="shape.x+shape.w" :y2="shape.y+shape.h"
        :stroke="shape.stroke" :stroke-width="shape.strokeWidth" :opacity="shape.opacity"
        :class="{'shape-selected': selectedShape===shape.id}"
        @mousedown="$emit('shapedrag', $event, shape)" />
      <!-- arrow -->
      <line v-else-if="shape.type==='arrow'" :x1="shape.x" :y1="shape.y" :x2="shape.x+shape.w" :y2="shape.y+shape.h"
        :stroke="shape.stroke" :stroke-width="shape.strokeWidth" :opacity="shape.opacity"
        marker-end="url(#arrowhead)"
        :class="{'shape-selected': selectedShape===shape.id}"
        @mousedown="$emit('shapedrag', $event, shape)" />
      <!-- triangle -->
      <polygon v-else-if="shape.type==='triangle'"
        :points="`${shape.x+shape.w/2},${shape.y} ${shape.x},${shape.y+shape.h} ${shape.x+shape.w},${shape.y+shape.h}`"
        :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth" :opacity="shape.opacity"
        :class="{'shape-selected': selectedShape===shape.id}"
        @mousedown="$emit('shapedrag', $event, shape)" />
      <!-- resize handle -->
      <rect v-if="selectedShape===shape.id" :x="shape.x+shape.w-4" :y="shape.y+shape.h-4"
        width="8" height="8" fill="#3b5fe0" rx="2" style="cursor:se-resize"
        @mousedown="$emit('shaperesize', $event, shape)" />
    </template>
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#1e40af" />
      </marker>
    </defs>
  </svg>
</template>

<script setup>
defineProps({
  shapes: Array,
  selectedShape: String
})
defineEmits(['shapedrag','shaperesize','shapemove','shapeup','clearselection'])
</script>

<style scoped>
.shape-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
.shape-layer * { pointer-events: auto; }
.shape-selected { filter: drop-shadow(0 0 3px rgba(59,95,224,.6)); }
</style>
