<script setup lang="ts">
import { ref, computed } from "vue";
import { useAppStatesStore } from "../stores/app_store";
import { useModalStore } from "../stores/modals_store";
import { useElementDragAndDrop } from "../composables/useElementDragAndDrop";
import { useMobileDragAndDrop } from "../composables/useMobileDragAndDrop";

const appStates = useAppStatesStore();
const modalStore = useModalStore();

const { horizontal, dataAttribute, elements, element, isCardDragged } =
  defineProps<{
    horizontal?: boolean;
    dataAttribute: string;
    elements: Array<Workspace | TaskList | Card>;
    element: Workspace | TaskList | Card;
    isCardDragged?: boolean;
  }>();

const currentElement = computed(() => element);

const draggedOver = ref(false);
const isAbove = ref(false);
const elementHeight = ref(2);

const elementRef = ref<HTMLElement | null>(null);

const { startDrag, onDrop, dragEnter, dragLeave } = useElementDragAndDrop(
  currentElement,
  elements,
  draggedOver,
  isAbove,
  elementHeight,
  isCardDragged,
);

const { onDragStart, onDrag, onDragEnd } = useMobileDragAndDrop(
  currentElement,
  elements,
  dataAttribute,
);
</script>
<template>
  <div ref="elementRef" :[dataAttribute]="currentElement.id">
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver && isAbove }"
      :style="{ height: draggedOver && isAbove ? elementHeight + 'px' : '2px' }"
      id="up"
    />
    <slot></slot>
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
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}
</style>
