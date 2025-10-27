import { defineStore } from "pinia";
import { type Workspace } from "../interfaces/Workspace";
import { type Ref, ref } from "vue";
import { useTaskListsStore } from "./tasklists";
import { v4 as uuid } from "uuid";

export const useWorkspacesStore = defineStore(
  "workspaces",
  () => {
    const workspaces: Ref<Workspace[]> = ref([]);
    const taskLists = useTaskListsStore();
    function addWorkspace(workspace?: { id: string; title: string }) {
      workspaces.value.push({
        ...(workspace ?? {
          id: uuid(),
          title: "Board " + (workspaces.value.length + 1),
        }),
        order: workspaces.value.length
          ? workspaces.value[workspaces.value.length - 1].order + 1
          : 0,
        type: "board",
      });
    }

    function editWorkspace(workspace: Workspace) {
      const index = workspaces.value.findIndex(
        (item) => item.id === workspace.id,
      );
      workspaces.value[index] = workspace;
    }
    function removeWorkspace(id: string) {
      taskLists.cascadeDeleteTaskListsByWorkspaceId(id);
      workspaces.value = workspaces.value = workspaces.value.filter(
        (workspace) => workspace.id !== id,
      );
    }

    return {
      workspaces,
      addWorkspace,
      editWorkspace,
      removeWorkspace,
    };
  },
  { persist: true },
);
