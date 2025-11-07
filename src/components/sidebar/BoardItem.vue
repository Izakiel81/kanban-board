<script setup lang="ts">
import { type Workspace } from "../../interfaces/Workspace";
import DragAndDropContainer from "../ui/DragAndDropContainer.vue";
import ContextMenu from "../ui/ContextMenu.vue";
import { useElementDragAndDrop } from "../../composables/useElementDragAndDrop.ts";
import { useWorkspacesStore } from "../../stores/workspaces";
import { useAppStatesStore } from "../../stores/app_store";
import { useModalStore } from "../../stores/modals_store";
import DeleteDialog from "../main/ui/DeleteDialog.vue";
import DeleteButton from "../main/ui/DeleteButton.vue";
import EditButton from "../main/ui/EditButton.vue";
import { ref, computed, nextTick } from "vue";

const { workspace } = defineProps<{
  workspace: Workspace;
}>();

const boardsStore = useWorkspacesStore();
const appStates = useAppStatesStore();
const modalStore = useModalStore();

const currentBoard = computed(() => workspace);

const showDeleteDialog = ref(false);
const showButtons = ref(false);
const isEditing = ref(false);

const newBoardTitleRef = ref<HTMLElementTextarea | null>(null);
const newBoardTitle = ref<string>(currentBoard.value.title);

function deleteBoard(id: string) {
  boardsStore.removeWorkspace(id);
  appStates.currentBoardId = "";
}

function startEditing() {
  isEditing.value = true;
  nextTick(() => {
    newBoardTitleRef.value && newBoardTitleRef.value.focus();
  });
}
function finishEditing() {
  if (!newBoardTitle.value || !newBoardTitle.value.trim()) return;

  currentBoard.value.title = newBoardTitle.value;
  isEditing.value = false;
}

function boardClick() {
  appStates.currentBoardId = currentBoard.value.id;
}
</script>
<template>
  <DragAndDropContainer
    :dataAttribute="'data-board-id'"
    :elements="boardsStore.workspaces"
    :element="currentBoard"
    :mouseOver="() => (showButtons = true)"
    :mouseLeave="() => (showButtons = false)"
    :onClick="boardClick"
    v-if="!isEditing"
  >
    <li class="board" :key="currentBoard.id">
      <span class="board-title">
        {{ currentBoard.title }}
        <ContextMenu :items="[{ title: '1', onClick: () => {} }]" />
        <span
          class="buttons"
          id="edit-delete"
          :style="{ opacity: showButtons ? 1 : 0 }"
        >
          <EditButton :width="16" :height="16" @click.stop="startEditing" />
          <DeleteButton
            :width="16"
            :height="16"
            :fill="'#000'"
            @click.stop="
              () => {
                showDeleteDialog = true;
                modalStore.modalIsA;
              }
            "
          />
        </span>
      </span>
    </li>
  </DragAndDropContainer>
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
  <DeleteDialog
    :show="showDeleteDialog"
    :title="'Are you sure you want to delete this board?'"
    :main="currentBoard.title"
    :onClick="() => deleteBoard(currentBoard.id)"
    :onCancel="() => (showDeleteDialog = false)"
  />
</template>
<style scoped>
.board {
  flex: 1;
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
  word-break: break-all;
}
.board:hover {
  background-color: white;
}
.board:active {
  filter: brightness(0.9);
}
.board-title {
  position: relative;
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
.buttons#edit-delete {
  position: absolute;
  top: 0;
  right: 0;
}
.buttons span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;

  transition: background-color 0.2s ease-out;
}
.buttons span:hover {
  background-color: #ddd;
}

@media (hover: none) and (pointer: coarse) {
  .board {
    background-color: #f4f4f4;
  }
  .buttons {
    display: none;
  }
}
</style>
