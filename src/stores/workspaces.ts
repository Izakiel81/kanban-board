import { defineStore } from "pinia";
import { Workspace } from "../interfaces/Workspace";
import { Ref, ref } from "vue";

export const useWorkspacesStore = defineStore("workspaces", () => {
  const workspaces: Ref<Workspace[]> = ref([]);

  function addWorkspace(workspace: Workspace) {
    workspaces.value.push(workspace);
  }

  function editWorkspace(workspace: Workspace) {
    const index = workspaces.value.indexOf(workspace);
    workspaces[index] = workspace;
  }
  function removeWorkspace(id: string) {
    workspaces.value = workspaces.value.filter(
      (workspace) => workspace.id !== id,
    );
  }

  function getWorkspaceIndexById(workspaceId: string) {
    return workspaces.value.findIndex(
      (workspace) => workspace.id === workspaceId,
    );
  }

  return {
    workspaces,
    addWorkspace,
    editWorkspace,
    removeWorkspace,
    getWorkspaceIndexById,
  };
});
