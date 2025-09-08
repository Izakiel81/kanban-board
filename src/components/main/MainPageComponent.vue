<script lang="ts" setup>
import TaskList from "./task-list/TaskList.vue";
import { useTaskListsStore } from "../../stores/tasklists";
import { watch, ref } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{ id: string }>();

const tasklistsStore = useTaskListsStore();
const currentWorkspaceId = ref(null);
const route = useRoute();

const isAdding = ref(false);
const newTaskListTitle = ref("");

watch(
  () => route.params.id,
  (newId, oldId) => {
    currentWorkspaceId.value = newId;
  },
);

function startAdding() {}
</script>

<template>
  <div class="container">
    <TaskList
      v-for="tasklist in tasklistsStore.getTaskListsByWorkspaceId(
        currentWorkspaceId,
      )"
    />
    <div class="new-list-container">
      <input />
      <span class="new-list-container-buttons">
        <button>Add</button>
        <span id="close" />
      </span>
    </div>
    <div class="add-list-container" @click="">
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
  padding: 6px 40px;

  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
}

#close {
  position: relative;
  user-select: none;

  height: 30px;
  width: 30px;
  padding: 6px 10px;
  border-radius: 5px;

  background-color: #555;
}
#close::before,
#close::after {
  content: "";
  position: absolute;
  width: 56%;
  top: 46%;
  left: 21%;
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
