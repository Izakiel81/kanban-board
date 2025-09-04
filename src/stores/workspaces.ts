import { defineStore } from "pinia";
import { type Workspace } from "../interfaces/Workspace";
import { type Ref, ref } from "vue";
import { useTaskListsStore } from "./tasklists";

export const useWorkspacesStore = defineStore("workspaces", () => {
  const workspaces: Ref<Workspace[]> = ref([]);
  const taskLists = useTaskListsStore();
  function addWorkspace(workspace: Workspace) {
    workspaces.value.push(workspace);
  }

  function editWorkspace(workspace: Workspace) {
    const index = workspaces.value.indexOf(workspace);
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
});
