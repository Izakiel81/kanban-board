<script setup lang="ts">
import { type Workspace } from "../../interfaces/Workspace";
import { ref, computed } from "vue";

const { workspace } = defineProps<{ workspace: Workspace }>();

const currentBoard = computed(() => workspace);
const elementHeight = ref(0);
const draggedOver = ref(false);
const isAbove = ref(false);

const emit = defineEmits(["onDrop"]);

let counter = 0;

function startDrag(evt, item) {
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("boardId", item.id);
  evt.dataTransfer.setData("boardOrder", item.order);
  evt.dataTransfer.setData("height", evt.target.getBoundingClientRect().height);
}

function dragEnter(evt) {
  counter++;
  const boardId = evt.dataTransfer.getData("boardId");
  const boardOrder = evt.dataTransfer.getData("boardOrder");
  if (!boardId || boardId === currentBoard.value.id) return;
  draggedOver.value = true;
  isAbove.value = parseInt(boardOrder) > currentBoard.value.order;
  elementHeight.value = evt.dataTransfer.getData("height");
}

function dragLeave(evt) {
  counter--;
  if (counter > 0) return;
  counter = 0;
  draggedOver.value = false;
  isAbove.value = false;
  elementHeight.value = 0;
}
function onDrop(evt) {
  if (evt.dataTransfer.getData("boardId") === currentBoard.value.id) return;
  emit("onDrop", evt, currentBoard.value.id);
  dragLeave(evt);
}
</script>
<template>
  <li
    draggable="true"
    @dragover.prevent
    @dragstart.stop="startDrag($event, currentBoard)"
    @dragenter.stop="dragEnter($event)"
    @dragleave.stop="dragLeave($event)"
    @drop="onDrop($event)"
    @click="router.push('/' + currentBoard.id)"
    class="board"
  >
    <span
      class="drag-area"
      :class="{ 'dragged-on': draggedOver & isAbove }"
      :style="{
        width: draggedOver & isAbove ? '100%' : 0,
        height: draggedOver & isAbove ? elementHeight + 'px' : 0,
      }"
    ></span>
    {{ currentBoard.title }}
    <span
      class="drag-area"
      :class="{ 'dragged-on': draggedOver & !isAbove }"
      :style="{
        width: draggedOver & !isAbove ? '100%' : 0,
        height: draggedOver & !isAbove ? elementHeight + 'px' : 0,
      }"
    ></span>
  </li>
</template>
<style scoped>
.board {
  user-select: none;

  display: flex;
  flex-direction: column;
  cursor: pointer;
  width: 100%;
  padding: 5px 10px;
  border-radius: 5px;

  transition:
    backgrouncolor 0.2s ease-out,
    filter 0.1s ease-out;
  overflow-wrap: break-word;
}
.board:hover {
  background-color: white;
}
.board:active {
  filter: brightness(0.9);
}
.drag-area {
  height: 0;
  transition:
    width 0.1s ease-out,
    height 0.1s ease-out;
}
.dragged-on {
  background-color: #555;
  border-radius: 6px;
  margin: 3px 0;
}
</style>
