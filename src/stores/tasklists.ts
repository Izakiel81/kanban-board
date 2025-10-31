import { defineStore } from "pinia";
import findMaxOrder from "./utils/findMaxOrder";
import { ref, type Ref } from "vue";
import { type TaskList } from "../interfaces/Workspace";

export const useTaskListsStore = defineStore(
  "tasklists",
  () => {
    const taskLists: Ref<TaskList[]> = ref([]);

    function addTaskList(taskList: {
      id: string;
      title: string;
      workspaceId: string;
    }) {
      let biggestOrder = findMaxOrder(taskLists.value);
      taskLists.value.push({
        ...taskList,
        order: biggestOrder + 1,
        type: "list",
        cards: [],
      });
    }

    function editTaskList(taskList: TaskList) {
      const index = taskLists.value.findIndex(
        (item) => item.id === taskList.id,
      );
      taskLists.value[index] = taskList;
    }

    function removeTaskList(taskListId: string) {
      taskLists.value = taskLists.value.filter(
        (taskList) => taskList.id !== taskListId,
      );
    }

    return {
      taskLists,
      addTaskList,
      editTaskList,
      removeTaskList,
    };
  },
  { persist: true },
);
