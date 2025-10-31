import { defineStore } from "pinia";
import findMaxOrder from "./utils/findMaxOrder";
import {
  type Card,
  type TaskList,
  type Workspace,
} from "../interfaces/Workspace";
import { type Ref, ref } from "vue";
import { v4 as uuid } from "uuid";

export const useWorkspacesStore = defineStore(
  "workspaces",
  () => {
    const workspaces: Ref<Workspace[]> = ref([]);
    function addWorkspace(workspace?: { id: string; title: string }) {
      let biggestOrder = findMaxOrder(workspaces.value);
      workspaces.value.push({
        ...(workspace ?? {
          id: uuid(),
          title: "Board " + (workspaces.value.length + 1),
          length,
        }),
        order: biggestOrder + 1,
        type: "board",
        lists: [],
      });
    }

    function editWorkspace(workspace: Workspace) {
      const index = workspaces.value.findIndex(
        (item) => item.id === workspace.id,
      );
      workspaces.value[index] = workspace;
    }
    function deleteItem(id: string, list: Array<Workspace | TaskList | Card>) {
      const index = list.findIndex((item) => item.id === id);
      if (index === -1) return;
      list.splice(index, 1);
    }
    function removeWorkspace(id: string) {
      workspaces.value = workspaces.value = workspaces.value.filter(
        (workspace) => workspace.id !== id,
      );
    }

    function addTaskList(workspaceId: string) {}
    function editTaskList(newTaskList: TaskList) {}
    function addCard(workspaceId: string) {}
    function editCard(newCard: Card) {}

    return {
      workspaces,
      addWorkspace,
      editWorkspace,
      removeWorkspace,
      deleteItem,
    };
  },
  { persist: true },
);
