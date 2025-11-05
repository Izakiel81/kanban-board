<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAppStatesStore } from "../stores/app_store";
import { useModalStore } from "../stores/modals_store";
import { useElementDragAndDrop } from "../composables/useElementDragAndDrop";
import { useMobileDragAndDrop } from "../composables/useMobileDragAndDrop";

const appStates = useAppStatesStore();
const modalStore = useModalStore();

const {
  horizontal,
  dataAttribute,
  element,
  elements,
  mouseOver,
  mouseLeave,
  onClick,
} = defineProps<{
  horizontal?: boolean;
  dataAttribute: string;
  elements: Array<Workspace | TaskList | Card>;
  element: Workspace | TaskList | Card;
  mouseOver: () => void;
  mouseLeave: () => void;
  onClick: () => void;
}>();

const emit = defineEmits(["cardIsDragged"]);

const currentElement = computed(() => element);

const draggedOver = ref(false);
const isAbove = ref(false);
const elementHeight = ref(2);
const isCardDragged = ref(false);

const elementRef = ref<HTMLElement | null>(null);

watch(isCardDragged, (newValue) => {
  emit("cardIsDragged", {
    isCardDragged: newValue,
    elementHeight: elementHeight.value,
  });
});

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
  horizontal,
);

const upStyles = computed(() =>
  horizontal
    ? {
        width: draggedOver.value && isAbove.value ? 230 + "px" : 1 + "px",
        height:
          draggedOver.value && isAbove.value ? elementHeight.value + "px" : 0,
        top: draggedOver.value ? "-2px" : 0,
        marginInline: draggedOver.value ? "3px" : 0,
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
        marginInline: draggedOver.value ? "3px" : 0,
      }
    : {
        height:
          draggedOver.value && !isAbove.value
            ? elementHeight.value + "px"
            : "2px",
      },
);

let touchTimeout;

function touchStart(element: HTMLElement) {
  touchTimeout = setTimeout(() => onDragStart(element), 120);
}
function touchEnd(element: HTMLElement) {
  clearTimeout(touchTimeout);
}
</script>
<template>
  <div
    :class="horizontal ? 'list-container' : 'wrapper'"
    ref="elementRef"
    :draggable="!modalStore.modalIsActive"
    :[dataAttribute]="currentElement.id"
    @click="onClick"
    @touchstart.stop="touchStart(elementRef)"
    @touchmove.stop="onDrag($event, elementRef)"
    @touchend.stop="touchEnd(elementRef)"
    @dragstart.stop="startDrag($event)"
    @mouseover.stop="mouseOver"
    @mouseleave.stop="mouseLeave"
    @dragover.prevent
    @dragenter.prevent.stop="dragEnter()"
    @dragleave.prevent.stop="dragLeave()"
    @drop.stop="onDrop()"
  >
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver && isAbove }"
      :style="upStyles"
      :id="horizontal ? 'left' : 'up'"
    />
    <slot></slot>
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver && !isAbove }"
      :style="downStyles"
      :id="horizontal ? 'right' : 'down'"
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
