<script setup lang="ts">
import BoardItem from "./BoardItem.vue";
import { useWorkspacesStore } from "../../stores/workspaces.ts";
import { watch, ref, computed, nextTick } from "vue";
import { v4 as uuid } from "uuid";
import { useRouter } from "vue-router";

const router = useRouter();

const workspacesStore = useWorkspacesStore();

const currentWorkspaces = computed(() =>
  workspacesStore.workspaces.sort((a, b) => a.order - b.order),
);

const isAddingWorkspace = ref(false);
const newWorkspaceTitle = ref("");

const inputRef = ref(null);
const buttonRef = ref(false);

function startAdding() {
  isAddingWorkspace.value = true;
  nextTick(() => {
    inputRef.value && inputRef.value.focus();
  });
}
function finishAdding() {
  newWorkspaceTitle.value
    ? workspacesStore.addWorkspace({
        id: uuid(),
        title: newWorkspaceTitle.value,
      })
    : workspacesStore.addWorkspace();

  newWorkspaceTitle.value = "";
  isAddingWorkspace.value = false;
  if (buttonRef.value) buttonRef.value.disabled = true;
  setTimeout(() => {
    if (buttonRef.value) buttonRef.value.disabled = false;
  }, 200);
}

function drop(evt, id) {
  const boardId = evt.dataTransfer.getData("boardId");
  if (!boardId) return;
  const draggedItemIndex = workspacesStore.workspaces.findIndex(
    (item) => item.id === boardId,
  );
  const droppedItemIndex = workspacesStore.workspaces.findIndex(
    (item) => item.id === id,
  );

  workspacesStore.workspaces[draggedItemIndex].order =
    workspacesStore.workspaces[draggedItemIndex].order +
    workspacesStore.workspaces[droppedItemIndex].order;
  workspacesStore.workspaces[droppedItemIndex].order =
    workspacesStore.workspaces[draggedItemIndex].order -
    workspacesStore.workspaces[droppedItemIndex].order;
  workspacesStore.workspaces[draggedItemIndex].order =
    workspacesStore.workspaces[draggedItemIndex].order -
    workspacesStore.workspaces[droppedItemIndex].order;
}
</script>

<template>
  <div class="sidebar">
    <header>
      <img src="../../assets/logo.png" alt="logo" />
      <h1>Kanban board</h1>
      <hr />
    </header>
    <main>
      <ul>
        <BoardItem
          v-for="workspace in currentWorkspaces"
          :workspace="workspace"
          @onDrop="(event, id) => drop(event, id)"
        />
      </ul>
      <input
        class="add-workspace-title"
        ref="inputRef"
        placeholder="Workspace title"
        v-model="newWorkspaceTitle"
        v-if="isAddingWorkspace"
        @keyup.escape="
          () => {
            ((isAddingWorkspace = false), (newWorkspaceTitle = ''));
          }
        "
        @blur="finishAdding()"
      />
    </main>
    <footer>
      <button ref="buttonRef" @click="startAdding()">
        {{ !isAddingWorkspace ? "+ Add board" : "Done" }}
      </button>
    </footer>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;

  width: 250px;
  height: 100vh;
  background-color: #f4f4f4;

  font-family: "Poppins", sans-serif;
}
header {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
  padding: 20px 20px 0;
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
main {
  flex-grow: 1;
  padding: 0 20px 20px;
  overflow: auto;
}
main ul {
  list-style: none;
  padding: 0;
  width: 100%;
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
footer button {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;

  transition: filter 100ms ease-in-out;
}
footer button:hover {
  filter: brightness(90%);
}
footer button:active {
  filter: brightness(80%);
  transition: filter 0ms;
}
</style>
