import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { type TaskList } from "../interfaces/Workspace";

export const useTaskLists = defineStore("tasklists", () => {
  const taskLists: Ref<TaskList[]> = ref([]);

  function addTaskList(taskList: TaskList) {
    taskLists.value.push(taskList);
  }

  function editTaskList(taskList: TaskList) {
    const index = taskLists.value.indexOf(taskList);

    taskLists.value[index] = taskList;
  }

  function removeTaskList(taskListId: string) {
    taskLists.value.filter((taskList) => taskList.id !== taskListId);
  }

  return {
    taskLists,
    addTaskList,
    editTaskList,
    removeTaskList,
  };
});
