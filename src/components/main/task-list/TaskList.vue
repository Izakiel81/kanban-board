<script setup lang="ts">
import TaskListItem from "./TaskListItem.vue";
import DeleteButton from "../../main/ui/DeleteButton.vue";
import ModalDialog from "../../main/ui/ModalDialog.vue";
import ModalDialogButton from "../../main/ui/ModalDialogButton.vue";
import { type TaskList } from "../../../interfaces/Workspace";
import { useTaskListsStore } from "../../../stores/tasklists";
import { useCardsStore } from "../../../stores/cards";
import { computed, ref } from "vue";
import { v4 as uuid } from "uuid";
import { useElementDragAndDrop } from "../../../composables/useElementDragAndDrop.ts";

const props = defineProps<{
  taskLists: Array<TaskLists>;
  taskList: TaskList;
}>();

const currentTaskList = computed(() => props.taskList);

const isEditingTitle = ref(false);
const newTaskListTitle = ref(props.taskList.title || "");

const taskListsStore = useTaskListsStore();
const cardsStore = useCardsStore();

const elementHeight = ref(0);
const isOnLeft = ref(false);
const cardIsDragged = ref(false);
const draggedOver = ref(false);
const showDeleteButton = ref(false);
const isDeleting = ref(false);

const currentCards = computed(() =>
  cardsStore
    .getCardsByTaskListId(currentTaskList.value.id)
    .sort((a, b) => a.order - b.order),
);

const isAddingCard = ref(false);
const newCardTitle = ref("");

const { startDrag, dragLeave, dragEnter, onDrop } = useElementDragAndDrop(
  currentTaskList,
  props.taskLists,
  draggedOver,
  isOnLeft,
  elementHeight,
  cardIsDragged,
);

function addCard() {
  if (!newCardTitle.value || !newCardTitle.value.trim()) return;

  cardsStore.addCard({
    id: uuid(),
    taskListId: currentTaskList.value.id,
    title: newCardTitle.value,
  });

  isAddingCard.value = false;
  newCardTitle.value = "";
}
function startEditing() {
  newTaskListTitle.value = currentTaskList.value.title;
  isEditingTitle.value = true;
}
function editTitle() {
  if (!newTaskListTitle.value || !newTaskListTitle.value.trim()) return;
  taskListsStore.editTaskList({
    ...props.taskList,
    title: newTaskListTitle.value,
  } as TaskList);

  newTaskListTitle.value = "";
  isEditingTitle.value = false;
}
</script>

<template>
  <div
    class="list-container"
    draggable="true"
    @dragover.prevent
    @drop.stop="onDrop()"
    @dragenter.stop="dragEnter()"
    @dragleave.stop="dragLeave()"
    @dragstart.stop="startDrag($event)"
    @mouseenter="showDeleteButton = true"
    @mouseleave="showDeleteButton = false"
  >
    <span
      class="drag-area"
      id="left"
      :style="{
        width: draggedOver && isOnLeft ? 230 + 'px' : 1 + 'px',
        height: draggedOver && isOnLeft ? elementHeight + 'px' : 0,
      }"
      :class="{ 'dragged-on': draggedOver && isOnLeft }"
    ></span>
    <div class="list">
      <div class="title-container">
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
          v-model="newTaskListTitle"
          rows="1"
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
            @click.stop="isDeleting = true"
          />
        </span>
      </div>
      <div class="task-list-wrapper">
        <TaskListItem
          v-for="card in currentCards"
          :key="card.id"
          :card="card"
        />
      </div>
      <div
        id="card"
        class="drag-area"
        :class="{ 'dragged-on': cardIsDragged }"
        :style="{
          width: cardIsDragged ? '100%' : 0,
          height: cardIsDragged ? elementHeight + 'px' : 0,
        }"
      ></div>
      <button
        class="list-add"
        v-if="!isAddingCard"
        @click="isAddingCard = true"
      >
        + Add Card
      </button>
      <div class="new-card-container" v-else>
        <textarea name="" id="" v-model="newCardTitle" rows="1"></textarea>
        <span class="new-card-container-buttons">
          <button @click="addCard()">Add card</button>
          <span
            id="close"
            @click="
              () => {
                ((isAddingCard = false), (newCardTitle = ''));
              }
            "
          />
        </span>
      </div>
    </div>
    <span
      class="drag-area"
      id="left"
      :class="{ 'dragged-on': draggedOver && !isOnLeft }"
      :style="{
        width: draggedOver && !isOnLeft ? 230 + 'px' : 1 + 'px',
        height: draggedOver && !isOnLeft ? elementHeight + 'px' : 0,
      }"
    >
    </span>
  </div>
  <ModalDialog :show="isDeleting" :onCancel="() => (isDeleting = false)">
    <template #header>Are you sure you want to delete this list?</template>
    <template #default>{{ currentTaskList.title }}</template>
    <template #footer>
      <ModalDialogButton
        @click.stop="
          taskListsStore.removeTaskList(currentTaskList.id);
          isDeleting = false;
        "
        >Yes</ModalDialogButton
      >
      <ModalDialogButton :bgcolor="'#ff0000'" @click.stop="isDeleting = false"
        >Cancel</ModalDialogButton
      >
    </template>
  </ModalDialog>
</template>

<style scoped>
.list-container {
  display: flex;
}
.drag-area {
  position: relative;
  height: 100%;

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
  display: flex;
  margin-bottom: 5px;
}
.dots {
  display: flex;
  align-items: center;
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
  width: calc(100% - 20px);
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
.new-card-container {
  margin-bottom: 5px;

  display: flex;
  flex-flow: wrap column;

  gap: 2px;
  background-color: #fff;
  border-radius: 3px;
  padding: 4px 7px;
}
.new-card-container textarea {
  resize: none;

  outline: none;

  border: 2px solid #ccc;
  border-radius: 3px;

  padding: 2px 5px;

  transition: border-color 0.3s ease-out;
}
.new-card-container textarea:focus {
  border-color: #007bff;
}
.new-card-container-buttons {
  display: flex;
  align-items: center;
  gap: 5px;
}
.new-card-container-buttons button {
  cursor: pointer;

  padding: 6px 40px;

  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 3px;

  transition: filter 0.1s ease-in-out;
}
.new-card-container-buttons button:hover {
  filter: brightness(90%);
}
.new-card-container-buttons button:active {
  filter: brightness(80%);
}
#close {
  cursor: pointer;

  position: relative;
  user-select: none;

  height: 28px;
  width: 28px;
  padding: 6px 10px;

  border-radius: 2px;

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
  top: 47%;
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

  position: relative;
  top: 6px;

  display: flex;
  justify-content: center;

  width: 22px;
  height: 21px;
  padding: 1px 3px 22px 3px;
  border-radius: 3px;

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
