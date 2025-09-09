<script setup lang="ts">
import TaskListItem from "./TaskListItem.vue";
import { type TaskList } from "../../../interfaces/Workspace";
import { useTaskListsStore } from "../../../stores/tasklists";
import { useCardsStore } from "../../../stores/cards";
import { computed, ref } from "vue";
import { v4 as uuid } from "uuid";

const props = defineProps<{ taskList: TaskList }>();
const currentTaskList = computed(() => props.taskList);

const isEditingTitle = ref(false);
const newTaskListTitle = ref("");

const taskListsStore = useTaskListsStore();
const cardsStore = useCardsStore();

const currentCards = computed(() =>
  cardsStore.getCardsByTaskListId(currentTaskList.value.id),
);

const isAddingCard = ref(false);
const newCardTitle = ref("");

function addCard() {
  if (!newCardTitle) return;

  cardsStore.addCard({
    id: uuid(),
    taskListId: currentTaskList.value.id,
    title: newCardTitle.value,
  });

  isAddingCard.value = false;
  newCardTitle.value = "";
}

function editTitle() {
  if (!newTaskListTitle) return;
  taskListsStore.editTaskList({
    id: props.taskList.id,
    title: newTaskListTitle.value,
    workspaceId: props.taskList.workspaceId,
  } as TaskList);

  newTaskListTitle.value = "";
  isEditingTitle.value = false;
}
</script>

<template>
  <div class="list">
    <div class="title-container">
      <h2 class="title" v-if="!isEditingTitle">
        <button class="title-button" @click="isEditingTitle = true">
          {{ currentTaskList.title }}
        </button>
      </h2>
      <textarea
        aria-multiline="true"
        class="title-textarea"
        v-model="newTaskListTitle"
        v-else
        @blur="editTitle()"
      ></textarea>
    </div>
    <TaskListItem v-for="card in currentCards" :key="card.id" :card="card" />
    <button class="list-add" v-if="!isAddingCard" @click="isAddingCard = true">
      + Add Card
    </button>
    <div class="new-card-container" v-else>
      <textarea name="" id="" v-model="newCardTitle"></textarea>
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
</template>

<style scoped>
.title-container {
  display: flex;
  margin-bottom: 5px;
}
.title {
  width: 100%;
}
.title-button {
  width: 100%;
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

  min-width: 230px;
  min-height: 50px;

  padding: 10px;

  border-radius: 8px;
}
.new-card-container {
  margin-bottom: 5px;

  display: flex;
  flex-flow: wrap column;

  gap: 2px;
  background-color: #fff;
  border-radius: 6px;
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
  border-radius: 5px;

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
.list-add {
  cursor: pointer;

  width: 100%;
  height: 25px;

  border: 1px solid #ffffff7f;
  border-radius: 5px;

  color: #fff;
  background-color: transparent;
}
.list-add:hover {
  filter: brightness(80%);
}
</style>
