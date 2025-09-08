<script lang="ts" setup>
import TaskList from "./task-list/TaskList.vue";
import { useTaskListsStore } from "../../stores/tasklists";
import { watch, ref, computed } from "vue";
import { v4 as uuid } from "uuid";

const props = defineProps<{ id?: string }>();
const tasklistsStore = useTaskListsStore();

const currentWorkspaceId = computed(() => props.id);
const isAdding = ref(false);
const newTaskListTitle = ref("");

const currentTaskLists = computed(() =>
  tasklistsStore.getTaskListsByWorkspaceId(currentWorkspaceId.value),
);

function addTaskList() {
  if (!newTaskListTitle) return;
  tasklistsStore.addTaskList({
    id: uuid(),
    workspaceId: currentWorkspaceId.value,
    title: newTaskListTitle.value,
  });
  isAdding.value = false;
  newTaskListTitle.value = "";
}
</script>

<template>
  <div class="container">
    <TaskList
      v-if="currentTaskLists"
      v-for="taskList in currentTaskLists"
      :key="taskList.id"
      :taskList="{
        id: taskList.id,
        title: taskList.title,
        workspaceId: taskList.workspaceId,
      }"
    />
    <div class="new-list-container" v-if="isAdding">
      <input v-model="newTaskListTitle" />
      <span class="new-list-container-buttons">
        <button @click="addTaskList()">Add</button>
        <span
          id="close"
          @click="
            () => {
              ((isAdding = false), (newTaskListTitle = ''));
            }
          "
        />
      </span>
    </div>
    <div class="add-list-container" @click="isAdding = true" v-else>
      <h1>+ Add list</h1>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: flex-start;

  padding: 10px;

  gap: 10px;
}
.new-list-container {
  display: flex;
  flex-direction: column;

  gap: 5px;

  padding: 5px;

  min-width: 250px;

  background-color: #0000005f;

  border-radius: 8px;
}
.new-list-container input {
  outline: none;

  border: 2px solid #999;
  border-radius: 3px;

  padding: 2px 5px;

  transition: border-color 0.3s ease-out;
}

.new-list-container input:focus {
  border-color: #007bff;
}
.new-list-container-buttons {
  display: flex;
  align-items: center;
  gap: 5px;
}
.new-list-container-buttons button {
  cursor: pointer;

  padding: 6px 40px;

  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;

  transition: filter 0.1s ease-in-out;
}
.new-list-container-buttons button:hover {
  filter: brightness(90%);
}
.new-list-container-buttons button:active {
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

  background-color: #555;

  transition: filter 0.1s ease-in-out;
}
#close:hover {
  filter: brightness(120%);
}
#close:active {
  filter: brightness(110%);
}
#close::before,
#close::after {
  content: "";
  position: absolute;
  width: 56%;
  top: 46%;
  left: 20%;
  border: 1px solid #aaa;
  border-radius: 5px;
}

#close::before {
  transform: rotate(45deg);
}
#close::after {
  transform: rotate(-45deg);
}

.add-list-container {
  display: flex;

  border: 2px dashed #ccc;
  border-radius: 8px;

  min-width: 250px;
  min-height: 70px;

  justify-content: center;
  align-items: center;
  text-align: center;

  user-select: none;

  cursor: pointer;
}
.add-list-container:hover {
  background-color: #cccccc69;
}
.add-list-container:active {
  filter: brightness(90%);
}
.add-list-container h1 {
  color: #ccc;
  font:
    500 20px/24px "Poppins",
    sans-serif;
}
</style>
