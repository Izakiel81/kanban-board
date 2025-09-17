<script setup lang="ts">
import { useWorkspacesStore } from "../../stores/workspaces.ts";
import { watch, ref, nextTick } from "vue";
import { v4 as uuid } from "uuid";
import { useRouter } from "vue-router";

const router = useRouter();

const workspacesStore = useWorkspacesStore();

const isAddingWorkspace = ref(false);
const newWorkspaceTitle = ref("");

const inputRef = ref(null);
const buttonRef = ref(false);
const draggedOver = ref(false);
const isAbove = ref(false);

let counter = 0;

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

function startDrag(evt, item) {
  console.log("startDrag");
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("boardId", item.id);
  evt.dataTransfer.setData("boardOrder", item.order);
  evt.dataTransfer.setData("width", evt.target.getBoundingClientRect().width);
  evt.dataTransfer.setData("height", evt.target.getBoundingClientRect().height);
}

function dragEnter(evt) {}
function dragLeave(evt) {}
function drop(evt) {}
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
        <li
          draggable="true"
          @dragstart="startDrag($event, workspace)"
          @click="router.push('/' + workspace.id)"
          v-for="workspace in workspacesStore.workspaces"
        >
          {{ workspace.title }}
        </li>
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

main li {
  user-select: none;

  cursor: pointer;
  width: 100%;
  padding: 5px 10px;
  border-radius: 5px;

  transition:
    background-color 0.2s ease-out,
    filter 0.1s ease-out;
  overflow-wrap: break-word;
}
main li:hover {
  background-color: white;
}
main li:active {
  filter: brightness(0.9);
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
