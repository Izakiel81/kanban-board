<script setup lang="ts">
import { ref, computed } from "vue";
import { useAppStatesStore } from "../stores/app_store";
import { useModalStore } from "../stores/modals_store";
import { useElementDragAndDrop } from "../composables/useElementDragAndDrop";
import { useMobileDragAndDrop } from "../composables/useMobileDragAndDrop";

const appStates = useAppStatesStore();
const modalStore = useModalStore();

const {
  horizontal,
  dataAttribute,
  elements,
  element,
  isCardDragged,
  mouseOver,
  mouseLeave,
  onClick,
} = defineProps<{
  horizontal?: boolean;
  dataAttribute: string;
  elements: Array<Workspace | TaskList | Card>;
  element: Workspace | TaskList | Card;
  isCardDragged?: boolean;
  mouseOver: () => void;
  mouseLeave: () => void;
  onClick: () => void;
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

const upStyles = computed(() =>
  horizontal
    ? {
        width: draggedOver.value && isAbove.value ? 230 + "px" : 1 + "px",
        height:
          draggedOver.value && isAbove.value ? elementHeight.value + "px" : 0,
        top: draggedOver.value ? "-2px" : 0,
        marginInline: draggedOver.value ? "4px" : 0,
      }
    : {
        height:
          draggedOver.value && isAbove.value
            ? elementHeight.value + "px"
            : "2px",
      },
);
const downStyles = computed(() =>
  horizontal
    ? {
        width: draggedOver.value && !isAbove.value ? 230 + "px" : 1 + "px",
        height:
          draggedOver.value && !isAbove.value ? elementHeight.value + "px" : 0,
        top: draggedOver.value ? "-2px" : 0,
        marginInline: draggedOver.value ? "4px" : 0,
      }
    : {
        height:
          draggedOver.value && !isAbove.value
            ? elementHeight.value + "px"
            : "2px",
      },
);
</script>
<template>
  <div
    :class="horizontal ? 'list-container' : 'wrapper'"
    ref="elementRef"
    :draggable="!modalStore.modalIsActive"
    :[dataAttribute]="currentElement.id"
    @click="onClick"
    @touchstart="onDragStart(elementRef)"
    @touchmove="onDrag($event, elementRef)"
    @touchend="onDragEnd(elementRef)"
    @dragstart.stop="startDrag($event)"
    @mouseover="mouseOver"
    @mouseleave="mouseLeave"
    @dragover.prevent
    @dragenter.prevent.stop="dragEnter()"
    @dragleave.prevent.stop="dragLeave()"
    @drop.stop="onDrop()"
  >
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver && isAbove }"
      :style="upStyles"
      id="up"
    />
    <slot></slot>
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver && !isAbove }"
      :style="downStyles"
      id="down"
    />
  </div>
</template>
<style scoped>
.list-container {
  display: flex;
}
.wrapper {
  display: flex;
  flex-direction: column;
}
.drag-target {
  cursor: pointer;
  position: relative;

  height: 2px;
  width: 100%;

  background-color: transparent;

  transition:
    width 0.1s ease-out,
    height 0.1s ease-out;
}
#up {
  top: -2px;
}
#down {
  top: 2px;
}
.dragged-on {
  background-color: #555;
  border-radius: 3px;
  margin: 3px 0;
}
</style>
