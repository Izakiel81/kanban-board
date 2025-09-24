<script setup lang="ts">
import { type Workspace } from "../../interfaces/Workspace";
import { useWorkspacesStore } from "../../stores/workspaces";
import ModalDialog from "../main/ui/ModalDialog.vue";
import ModalDialogButton from "../main/ui/ModalDialogButton.vue";
import DeleteButton from "../main/ui/DeleteButton.vue";
import EditButton from "../main/ui/EditButton.vue";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

const { workspace } = defineProps<{ workspace: Workspace }>();

const router = useRouter();

const boardsStore = useWorkspacesStore();

const currentBoard = computed(() => workspace);

const elementHeight = ref(0);
const draggedOver = ref(false);
const isAbove = ref(false);

const showDeleteDialog = ref(false);
const showButtons = ref(false);
const isEditing = ref(false);

const newBoardTitle = ref(currentBoard.value.title);
const newBoardTitleRef = ref(null);

const emit = defineEmits(["onDrop", "deleteBoard"]);

let counter = 0;

function deleteBoard(id: string) {
  boardsStore.removeWorkspace(id);
  if (boardsStore.workspaces.length === 0) {
    router.push("/");
  }
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

function dragLeave() {
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
function startEditing() {
  isEditing.value = true;
  nextTick(() => {
    newBoardTitleRef.value && newBoardTitleRef.value.focus();
  });
}
function finishEditing() {
  if (newBoardTitle.value) {
    currentBoard.value.title = newBoardTitle.value;
  }
  newBoardTitle.value = currentBoard.value.title;
  isEditing.value = false;
}
</script>
<template>
  <li
    draggable="true"
    class="board"
    v-if="!isEditing"
    @dragover.prevent
    @dragstart.stop="startDrag($event, currentBoard)"
    @dragenter.stop="dragEnter($event)"
    @dragleave.stop="dragLeave()"
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
    />
    <span class="board-title">
      {{ currentBoard.title }}
      <span class="buttons" :style="{ opacity: showButtons ? 1 : 0 }">
        <EditButton :width="16" :height="16" @click.stop="isEditing = true" />
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
    />
  </li>
  <div class="edit-board" v-else>
    <textarea
      v-model="newBoardTitle"
      ref="newBoardTitleRef"
      rows="1"
      @blur="finishEditing()"
    />
    <div class="buttons">
      <button>Done</button>
      <span id="close" />
    </div>
  </div>
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
        @click.stop="deleteBoard(currentBoard.id)"
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
.edit-board button {
  cursor: pointer;

  padding: 6px 40px;

  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;

  transition: filter 0.1s ease-in-out;
}
.edit-board button:hover {
  filter: brightness(80%);
}
.edit-board button:active {
  filter: brightness(90%);
}
.edit-board textarea {
  outline: none;
  resize: none;

  width: 100%;

  padding: 5px 10px;

  border-radius: 2px;
  border: 1px solid #888;

  transition: border-color 0.3s ease-out;
}
.edit-board textarea:focus {
  border-color: #007bff;
}
#close {
  cursor: pointer;

  position: relative;
  user-select: none;

  display: inline-block;

  height: 28px;
  width: 28px;
  padding: 6px 10px;

  border-radius: 5px;

  background-color: #ccc;

  transition: filter 0.1s ease-in-out;
}
#close:hover {
  filter: brightness(80%);
}
#close:active {
  filter: brightness(90%);
}
#close::before,
#close::after {
  content: "";
  position: absolute;
  width: 56%;
  top: 46%;
  left: 19%;
  border: 1px solid #fff;
  border-radius: 5px;
}

#close::before {
  transform: rotate(45deg);
}
#close::after {
  transform: rotate(-45deg);
}
.edit-board {
  display: flex;
  flex-direction: column;
  gap: 5px;
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
