import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { type TaskList } from "../interfaces/Workspace";
import { useCardsStore } from "./cards";

export const useTaskListsStore = defineStore(
  "tasklists",
  () => {
    const taskLists: Ref<TaskList[]> = ref([]);
    const cardsStore = useCardsStore();

    function addTaskList(taskList: TaskList) {
      taskLists.value.push(taskList);
    }

    function editTaskList(taskList: TaskList) {
      const index = taskLists.value.findIndex(
        (item) => item.id === taskList.id,
      );
      taskLists.value[index] = taskList;
    }

    function removeTaskList(taskListId: string) {
      cardsStore.cascadeDeleteCardsByTaskListId(taskListId);
      taskLists.value = taskLists.value.filter(
        (taskList) => taskList.id !== taskListId,
      );
    }

    function getTaskListsByWorkspaceId(workspaceId: string) {
      return taskLists.value.filter(
        (taskList) => taskList.workspaceId === workspaceId,
      );
    }

    function cascadeDeleteTaskListsByWorkspaceId(workspaceId: string) {
      taskLists.value.map((taskList) => {
        if (taskList.workspaceId === workspaceId) removeTaskList(taskList.id);
      });
    }

    return {
      taskLists,
      addTaskList,
      editTaskList,
      removeTaskList,
      getTaskListsByWorkspaceId,
      cascadeDeleteTaskListsByWorkspaceId,
    };
  },
  { persist: true },
);
