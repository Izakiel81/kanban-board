<script setup lang="ts">
import TaskListItem from "./TaskListItem.vue";
import DragAndDropContainer from "../../ui/DragAndDropContainer.vue";
import DeleteButton from "../../main/ui/DeleteButton.vue";
import DeleteDialog from "../../main/ui/DeleteDialog.vue";
import AddForm from "../../main/ui/AddForm.vue";
import { type TaskList } from "../../../interfaces/Workspace";
import { useAppStatesStore } from "../../../stores/app_store";
import { useWorkspacesStore } from "../../../stores/workspaces";
import { useModalStore } from "../../../stores/modals_store";
import { computed, ref, watch, nextTick } from "vue";
import { useElementDragAndDrop } from "../../../composables/useElementDragAndDrop.ts";

const props = defineProps<{
  taskLists: Array<TaskList>;
  taskList: TaskList;
}>();

const currentTaskList = computed(() => props.taskList);

const isEditingTitle = ref(false);
const newTaskListTitle = ref(props.taskList.title || "");

const appStates = useAppStatesStore();
const boardsStore = useWorkspacesStore();
const modalStore = useModalStore();

const elementHeight = ref(0);
const cardIsDragged = ref(false);
const showDeleteButton = ref(false);
const isDeleting = ref(false);

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const currentCards = computed(() =>
  currentTaskList.value.cards.sort((a, b) => a.order - b.order),
);

const isAddingCard = ref(false);

function autoResize() {
  if (!textareaRef.value) return;

  textareaRef.value.style.height = "auto";
  textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
}

function addCard(newCardTitle: string) {
  if (!newCardTitle || !newCardTitle.trim()) return;

  boardsStore.addCard(
    appStates.currentBoardId,
    currentTaskList.value.id,
    newCardTitle,
  );
}
function startEditing() {
  newTaskListTitle.value = currentTaskList.value.title;
  isEditingTitle.value = true;
}
function editTitle() {
  if (!newTaskListTitle.value || !newTaskListTitle.value.trim()) return;
  boardsStore.editTaskList(appStates.currentBoardId, currentTaskList.value.id, {
    ...props.taskList,
    title: newTaskListTitle.value,
  } as TaskList);

  newTaskListTitle.value = "";
  isEditingTitle.value = false;
}
function deleteTaskList() {
  boardsStore.deleteItem(currentTaskList.value.id, props.taskLists);
}
</script>

<template>
  <DragAndDropContainer
    :horizontal="true"
    :dataAttribute="'data-list-id'"
    :elements="props.taskLists"
    :element="currentTaskList"
    :mouseOver="() => (showDeleteButton = true)"
    :mouseLeave="() => (showDeleteButton = false)"
    :onClick="() => {}"
    @cardIsDragged="
      ($event) => {
        cardIsDragged = $event.isCardDragged;
        elementHeight = $event.elementHeight;
      }
    "
  >
    <div class="list">
      <div class="title-container" ref="textareaContainerRef">
        <div class="dots">
          <span />
          <span />
        </div>
        <h2 class="title" v-if="!isEditingTitle">
          <button class="title-button" @click="startEditing()">
            {{ currentTaskList.title }}
          </button>
        </h2>
        <textarea
          aria-multiline="true"
          class="title-textarea"
          ref="textareaRef"
          maxlength="300"
          @input="autoResize"
          rows="1"
          v-model="newTaskListTitle"
          v-else
          @blur="editTitle()"
          @keyup.enter="editTitle()"
          @keyup.escape="
            newTaskListTitle = '';
            isEditingTitle = false;
          "
        ></textarea>
        <span
          class="delete-button"
          :style="{ opacity: showDeleteButton ? 1 : 0 }"
        >
          <DeleteButton
            :width="20"
            :height="20"
            :color="'#d4d4d4'"
            @click.stop="
              () => {
                isDeleting = true;
                modalStore.modalIsActive = true;
              }
            "
          />
        </span>
      </div>
      <div
        id="card"
        class="drag-area"
        :class="{ 'dragged-on': cardIsDragged }"
        :style="{
          width: cardIsDragged ? '100%' : 2 + 'px',
          height: cardIsDragged ? elementHeight + 'px' : 2 + 'px',
        }"
      ></div>

      <div class="task-list-wrapper">
        <TaskListItem
          v-for="card in currentCards"
          :key="card.id"
          :card="card"
          :cards="taskList.cards"
        />
      </div>
      <button
        class="list-add"
        v-if="!isAddingCard"
        @click="isAddingCard = true"
      >
        + Add Card
      </button>
      <AddForm
        v-else
        :wBackground="true"
        :onClick="addCard"
        :onClose="() => (isAddingCard = false)"
      />
    </div>
  </DragAndDropContainer>
  <DeleteDialog
    :show="isDeleting"
    :title="'Are you sure you want to delete this list?'"
    :main="currentTaskList.title"
    :onClick="deleteTaskList"
    :onCancel="() => (isDeleting = false)"
  />
</template>

<style scoped>
.list-container {
  display: flex;
}
.drag-area {
  position: relative;
  height: 100%;
  background-color: transparent;

  transition:
    width 0.1s ease-out,
    height 0.1s ease-out;
}
.dragged-on {
  background-color: #555;
  border-radius: 3px;
  margin: 0 3px;
}
#card {
  margin: 0;
  margin-bottom: 5px;
}
.title-container {
  position: relative;
  display: flex;
  margin-bottom: 5px;
}
.dots {
  display: flex;
  align-items: flex-start;
  margin-top: 14px;
  gap: 3px;
  width: 9px;
  margin-right: 2px;
}
.dots span {
  display: block;
  position: relative;
  background-color: #fff;
  width: 3px;
  height: 3px;
  border-radius: 100%;
}
.dots span::before,
.dots span::after {
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  width: 3px;
  height: 3px;
  border-radius: 100%;
}

.dots span::before {
  top: -6px;
}

.dots span::after {
  top: 6px;
}

.title {
  width: calc(100% - 10px);
}
.title-button {
  width: 100%;
  height: 100%;
  text-align: left;

  background-color: transparent;
  color: white;

  border: none;
  padding: 5px 2px;
  font-size: 18px;
}
.title-textarea {
  width: 100%;
  height: 100%;
  min-height: 24px;

  field-sizing: content;
  box-sizing: border-box;
  resize: none;
  padding: 0 3px;
  font-size: 18px;
  overflow: hidden;
  overflow-wrap: break-word;
}
.list {
  background-color: #0000005f;

  width: 230px;
  height: fit-content;
  min-height: 50px;

  padding: 10px;

  border-radius: 2px;
}
.task-list-wrapper {
  display: flex;
  flex-direction: column;

  margin-bottom: 5px;

  gap: 5px;
}

.list-add {
  cursor: pointer;

  width: 100%;
  height: 25px;

  border: 1px solid #ffffff7f;
  border-radius: 3px;

  color: #fff;
  background-color: transparent;
}
.list-add:hover {
  filter: brightness(80%);
}
.delete-button {
  cursor: pointer;

  position: absolute;
  top: 4px;
  right: 5px;

  display: flex;
  justify-content: center;

  width: 22px;
  height: 21px;
  padding: 1px 3px 22px 3px;
  border-radius: 3px;

  background-color: #555;

  transition:
    opacity 0.2s ease-out,
    filter 0.1s ease-out,
    background-color 0.2s ease-out;
}
.delete-button:hover {
  background-color: #888;
}
.delete-button:active {
  filter: brightness(90%);
}
</style>
