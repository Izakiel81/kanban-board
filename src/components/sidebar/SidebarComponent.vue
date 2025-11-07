<script setup lang="ts">
import BoardItem from "./BoardItem.vue";
import AddForm from "../main/ui/AddForm.vue";
import { useWorkspacesStore } from "../../stores/workspaces.ts";
import { useAppStatesStore } from "../../stores/app_store.ts";
import { ref, computed, provide } from "vue";

const workspacesStore = useWorkspacesStore();
const appStates = useAppStatesStore();

const currentWorkspaces = computed(() =>
  workspacesStore.workspaces.sort((a, b) => a.order - b.order),
);

const isAddingWorkspace = ref(false);

const parentRef = ref<HTMLElement | null>(null);
provide("parentRef", parentRef);

function finishAdding(newTitle: string) {
  if (!newTitle || !newTitle.trim()) return;
  workspacesStore.addWorkspace(newTitle);
}
</script>

<template>
  <div class="sidebar">
    <header>
      <span class="fold-container">
        <span id="fold" @click.stop="appStates.showSidebar = false" />
      </span>
      <img src="../../assets/logo.png" alt="logo" />
      <h1>Kanban board</h1>
      <hr />
    </header>
    <main ref="parentRef">
      <ul>
        <BoardItem
          v-for="workspace in currentWorkspaces"
          :workspace="workspace"
          :key="workspace.id"
        />
      </ul>
      <AddForm
        v-if="isAddingWorkspace"
        :wBackground="true"
        :onClose="() => (isAddingWorkspace = false)"
        :onClick="finishAdding"
        :limit="150"
      />
      <button v-else class="add-button" @click="isAddingWorkspace = true">
        + Add board
      </button>
    </main>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;

  max-width: 245px;
  height: 99vh;
  background-color: #f4f4f4;

  border-radius: 7px;

  font-family: "Poppins", sans-serif;
}
header {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
  padding: 11px 11px 0;
}
header img {
  width: 100px;
  height: 100px;
}
header h1 {
  font-size: 25px;
  color: #333;
  text-align: center;
}
header hr {
  width: 100%;
  margin-bottom: 15px;
}
.fold-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 10px;
}
#fold {
  cursor: pointer;
  position: relative;
  margin-right: 5px;
  border-radius: 100%;
  padding: 17px;
  transition:
    background-color 0.1s ease,
    filter 0.1s ease-out;
}

#fold:hover {
  background-color: #eee;
}

#fold:active {
  filter: brightness(90%);
}

#fold::before,
#fold::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #aaa;
  border: 2px solid #aaa;
  border-radius: 2px;
  width: 17px;
}
#fold::before {
  transform: translate(-50%, -50%) rotate(45deg);
}
#fold::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
main {
  flex-grow: 1;
  padding: 0 4px 11px;
  overflow: auto;
}
main ul {
  list-style: none;
  padding: 0;
  width: 100%;
}
.buttons {
  display: flex;
  align-items: center;
  gap: 5px;

  margin: 3px 0;
}

.add-workspace-title {
  outline: none;

  width: 100%;

  padding: 5px 10px;

  border-radius: 2px;
  border: 1px solid #888;

  transition: border-color 0.3s ease-out;
}
.add-workspace-title:focus {
  border-color: #007bff;
}
.add-button {
  padding: 10px;
  border: none;
  border-radius: 3px;
  background-color: transparent;
  color: #666;
  font-size: 16px;
  cursor: pointer;

  transition:
    filter 100ms ease-in-out,
    background-color 100ms ease-in-out;
}
.add-button:hover {
  background-color: white;
}
.add-button:active {
  filter: brightness(80%);
}
@media (max-width: 600px) {
  .sidebar {
    position: fixed;
    inset: 0;
    height: 100vh;
    max-width: 100%;
    width: 100%;
  }
}
</style>
