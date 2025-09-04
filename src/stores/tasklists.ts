import { defineStore } from "pinia";
import { ref, Ref } from "vue";
import { TaskList } from "../interfaces/Workspace";

export const useTaskLists = defineStore("tasklists", () => {
  const taskLists: Ref<TaskList[]> = ref([]);

  function addTaskList(taskList: TaskList) {
    taskLists.value.push(taskList);
  }

  function editTaskList(taskList: TaskList) {
    const index = getTaskListIndexById(taskList.id);
    taskLists[index] = taskList;
  }

  function removeTaskList(taskListId: string) {
    taskLists.value.filter((taskList) => taskList.id !== taskListId);
  }

  function getTaskListIndexById(taskListId: string) {
    return taskLists.value.findIndex((taskList) => taskList.id === taskListId);
  }
  return {
    taskLists,
    addTaskList,
    editTaskList,
    removeTaskList,
    getTaskListIndexById,
  };
});
