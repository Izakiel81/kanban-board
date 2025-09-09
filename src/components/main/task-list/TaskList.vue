<script setup lang="ts">
import TaskListItem from "./TaskListItem.vue";
import { type TaskList } from "@/interfaces/workspaces";
import { useTaskListsStore } from "../../../stores/tasklists";
import { useCardsStore } from "../../../stores/cards";
import { computed, ref } from "vue";

const props = defineProps<{ taskList: TaskList }>();
const currentTaskList = computed(() => props.taskList);
const isEditingTitle = ref(false);
const newTaskListTitle = ref("");

const taskListsStore = useTaskListsStore();
const cardsStore = useCardsStore();

const currentCards = computed(() =>
  cardsStore.getCardsByTaskListId(currentTaskList.value.id),
);

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
    <TaskListItem v-for="card in currentCards" />
    <button class="list-add">+ Add Card</button>
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
