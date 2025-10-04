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
</script>

<template>
  <div class="sidebar">
    <header>
      <span class="fold-container">
        <span id="fold" @click.stop="() => {}" />
      </span>
      <img src="../../assets/logo.png" alt="logo" />
      <h1>Kanban board</h1>
      <hr />
    </header>
    <main>
      <ul>
        <BoardItem
          v-for="workspace in currentWorkspaces"
          :workspace="workspace"
        />
      </ul>
      <div>
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
        />
      </div>

      <div class="buttons">
        <button
          class="add-button"
          ref="buttonRef"
          @click="isAddingWorkspace ? finishAdding() : startAdding()"
          :id="isAddingWorkspace ? 'done' : null"
        >
          {{ !isAddingWorkspace ? "+ Add board" : "Done" }}
        </button>
        <span
          v-if="isAddingWorkspace"
          id="close"
          @click="
            () => {
              ((isAddingWorkspace = false), (newWorkspaceTitle = ''));
            }
          "
        />
      </div>
    </main>
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
  padding: 0 20px 20px;
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
#close {
  display: flex;
  cursor: pointer;

  position: relative;
  user-select: none;

  height: 28px;
  width: 28px;
  padding: 6px 10px;

  border-radius: 5px;

  background-color: #ccc;

  transition: filter 0.1s ease-in-out;
}
#close:hover {
  filter: brightness(80%);
}
#close:active {
  filter: brightness(90%);
}
#close::before,
#close::after {
  content: "";
  position: absolute;
  width: 56%;
  top: 48%;
  left: 18%;
  border: 1px solid #fff;
  border-radius: 5px;
}

#close::before {
  transform: rotate(45deg);
}
#close::after {
  transform: rotate(-45deg);
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
#done {
  background-color: #007bff;
  color: white;

  height: 28px;
  padding: 6px;
  font-size: 14px;
}
#done:hover {
  filter: brightness(90%);
}
</style>
