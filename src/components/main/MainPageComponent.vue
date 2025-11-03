<script lang="ts" setup>
import TaskList from "./task-list/TaskList.vue";
import { useWorkspacesStore } from "../../stores/workspaces";
import { useAppStatesStore } from "../../stores/app_store";
import AddForm from "./ui/AddForm.vue";
import { ref, computed } from "vue";

const props = defineProps<{ taskLists: Array<any> }>();
const boardsStore = useWorkspacesStore();

const appStates = useAppStatesStore();
const currentWorkspaceTitle = computed(() =>
  boardsStore.workspaces.filter(
    (workspace) => workspace.id === appStates.currentBoardId,
  ),
);

const isAdding = ref(false);
const newTaskListTitle = ref("");

const currentTaskLists = computed(() =>
  props.taskLists.sort((a, b) => a.order - b.order),
);

function addTaskList(newTaskListTitle: string) {
  if (!newTaskListTitle || !newTaskListTitle.trim()) return;
  boardsStore.addTaskList(appStates.currentBoardId, newTaskListTitle);
}
</script>

<template>
  <h1
    class="title-container"
    v-if="currentWorkspaceTitle && currentWorkspaceTitle.length > 0"
  >
    {{ currentWorkspaceTitle[0].title }}
  </h1>
  <div class="container" v-if="currentWorkspaceTitle">
    <TaskList
      v-if="currentTaskLists"
      v-for="taskList in currentTaskLists"
      :key="taskList.id"
      :taskList="taskList"
      :taskLists="taskLists"
    />
    <AddForm
      v-if="isAdding"
      :onClose="() => (isAdding = false)"
      :onClick="addTaskList"
      :wBackground="true"
    />
    <div class="add-list-container" @click="isAdding = true" v-else>
      <h1>+ Add list</h1>
    </div>
  </div>
</template>

<style scoped>
.title-container {
  color: #fff;
  padding: 0 10px;
  font-family: "Poppins", sans-serif;
}
.container {
  display: flex;
  align-items: flex-start;

  flex: 1;
  overflow: auto;

  padding: 10px;
  gap: 2px;
}

.add-list-container {
  display: flex;

  border: 2px dashed #fff;
  border-radius: 3px;

  min-width: 230px;
  min-height: 50px;

  justify-content: center;
  align-items: center;
  text-align: center;

  user-select: none;

  cursor: pointer;

  margin-left: 5px;
}
.add-list-container:hover {
  background-color: #cccccc69;
}
.add-list-container:active {
  filter: brightness(90%);
}
.add-list-container h1 {
  color: #fff;
  font:
    500 16px/20px "Poppins",
    sans-serif;
}
</style>
