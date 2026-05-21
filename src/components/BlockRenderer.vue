<template>
  <div class="block" :class="{selected: isSelected}"
    @click.stop="$emit('select', block.id)"
    draggable="true" @dragstart="$emit('dragstart')" @dragover.prevent @drop="$emit('drop')">
    <div class="block-handle">⋮⋮</div>
    <!-- heading -->
    <div v-if="block.type==='heading'" class="block-content heading"
      contenteditable @blur="onEdit" :style="block.style" v-html="block.content"></div>
    <!-- text -->
    <div v-else-if="block.type==='text'" class="block-content"
      contenteditable @blur="onEdit" :style="block.style" v-html="block.content"></div>
    <!-- list -->
    <div v-else-if="block.type==='list'" class="block-content list-block"
      contenteditable @blur="onEdit" :style="block.style" v-html="block.content"></div>
    <!-- image -->
    <div v-else-if="block.type==='image'" class="img-block">
      <div class="img-resizable" :style="{width: (block.imgWidth||300)+'px', transform: `translate(${block.imgX||0}px,${block.imgY||0}px)`}"
        @mousedown="$emit('imgdrag', $event, block)">
        <img :src="block.src" style="width:100%;display:block;border-radius:4px;" />
        <div class="img-resize-handle" @mousedown.stop="$emit('imgresize', $event, block)"></div>
      </div>
    </div>
    <!-- cards -->
    <div v-else-if="block.type==='cards'" class="cards-row">
      <div v-for="(card,ci) in block.cards" :key="ci" class="card-item" :style="card.style"
        contenteditable @blur="card.content=$event.target.innerHTML" v-html="card.content"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  block: Object,
  isSelected: Boolean
})
const emit = defineEmits(['select','edit','dragstart','drop','imgdrag','imgresize'])

function onEdit(e) {
  emit('edit', e, props.block)
}
</script>

<style scoped>
.block { position: relative; padding: 4px 4px 4px 20px; border-radius: 4px; border: 1px solid transparent; cursor: default; transition: border-color .15s; }
.block:hover { border-color: rgba(59,95,224,.2); }
.block.selected { border-color: #3b5fe0; background: rgba(59,95,224,.03); }
.block-handle { position: absolute; left: 2px; top: 50%; transform: translateY(-50%); cursor: grab; color: #ccc; font-size: 10px; opacity: 0; transition: opacity .15s; }
.block:hover .block-handle { opacity: 1; }
.block-content { outline: none; min-height: 24px; word-break: break-word; }
.block-content.heading { font-weight: bold; }
.block-content[contenteditable]:focus { background: rgba(59,95,224,.04); border-radius: 4px; }
.list-block :deep(ul), .list-block :deep(ol) { padding-left: 20px; }
.img-block { text-align: center; position: relative; }
.img-resizable { position: relative; display: inline-block; cursor: move; }
.img-resize-handle { position: absolute; right: -4px; bottom: -4px; width: 12px; height: 12px; background: #3b5fe0; border-radius: 50%; cursor: se-resize; }
.cards-row { display: flex; gap: 12px; flex-wrap: wrap; }
.card-item { flex: 1; min-width: 120px; color: #fff; font-weight: 500; border-radius: 8px; outline: none; }
</style>
