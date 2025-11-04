<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{ horizontal?: boolean }>();

const draggedOver = ref(false);
const isAbove = ref(false);
const elementHeight = ref(2);

const elementRef = ref<HTMLElement | null>(null);

const { startDrag, onDrop, dragEnter, dragLeave } = useElementDragAndDrop(
  currentCard,
  props.cards,
  draggedOver,
  isAbove,
  elementHeight,
);

const { onDragStart, onDrag, onDragEnd } = useMobileDragAndDrop(
  currentCard,
  props.cards,
  "data-card-id",
);
const {} = useMobileDragAndDrop();
</script>
<template>
  <div ref="elementRef">
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver && isAbove }"
      :style="{ height: draggedOver && isAbove ? elementHeight + 'px' : '2px' }"
      id="up"
    />
    <slot> </slot>
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver && !isAbove }"
      :style="{
        height: draggedOver && !isAbove ? elementHeight + 'px' : '2px',
      }"
      id="down"
    />
  </div>
</template>
<style scoped></style>
