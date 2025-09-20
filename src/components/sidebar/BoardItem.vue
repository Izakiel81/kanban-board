<script setup lang="ts">
import { type Workspace } from "../../interfaces/Workspace";
import ModalDialog from "../main/ui/ModalDialog.vue";
import ModalDialogButton from "../main/ui/ModalDialogButton.vue";
import DeleteButton from "../main/ui/DeleteButton.vue";
import EditButton from "../main/ui/EditButton.vue";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

const { workspace } = defineProps<{ workspace: Workspace }>();

const router = useRouter();

const currentBoard = computed(() => workspace);

const elementHeight = ref(0);
const draggedOver = ref(false);
const isAbove = ref(false);

const showDeleteDialog = ref(false);
const showButtons = ref(false);

const emit = defineEmits(["onDrop", "deleteBoard"]);

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
    class="board"
    @dragover.prevent
    @dragstart.stop="startDrag($event, currentBoard)"
    @dragenter.stop="dragEnter($event)"
    @dragleave.stop="dragLeave($event)"
    @drop="onDrop($event)"
    @click="router.push('/' + currentBoard.id)"
    @mouseover="showButtons = true"
    @mouseleave="showButtons = false"
  >
    <span
      class="drag-area"
      :class="{ 'dragged-on': draggedOver & isAbove }"
      :style="{
        width: draggedOver & isAbove ? '100%' : 0,
        height: draggedOver & isAbove ? elementHeight + 'px' : 0,
      }"
    ></span>
    <span class="board-title">
      {{ currentBoard.title }}
      <span class="buttons" :style="{ opacity: showButtons ? 1 : 0 }">
        <EditButton :width="16" :height="16" @click.stop="() => {}" />
        <DeleteButton
          :width="16"
          :height="16"
          :fill="'#000'"
          @click.stop="showDeleteDialog = true"
        />
      </span>
    </span>
    <span
      class="drag-area"
      :class="{ 'dragged-on': draggedOver & !isAbove }"
      :style="{
        width: draggedOver & !isAbove ? '100%' : 0,
        height: draggedOver & !isAbove ? elementHeight + 'px' : 0,
      }"
    ></span>
  </li>
  <ModalDialog
    :show="showDeleteDialog"
    :width="350"
    :onCancel="() => (showDeleteDialog = false)"
  >
    <template #header>Are you sure you want to delete this board?</template>
    <template #default>{{ currentBoard.title }}</template>
    <template #footer>
      <ModalDialogButton
        :width="70"
        :height="30"
        @click.stop="
          () => {
            emit('deleteBoard', currentBoard.id);
            showDeleteDialog = false;
          }
        "
      >
        Yes
      </ModalDialogButton>
      <ModalDialogButton
        :width="70"
        :bgcolor="'#ff0000'"
        @click.stop="() => (showDeleteDialog = false)"
      >
        Cancel
      </ModalDialogButton>
    </template>
  </ModalDialog>
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
.board-title {
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buttons {
  display: flex;
  align-items: center;
  gap: 5px;

  transition: opacity 0.2s ease-out;
}
.buttons span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;

  transition: background-color 0.2s ease-out;
}
.buttons span:hover {
  background-color: #ddd;
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
