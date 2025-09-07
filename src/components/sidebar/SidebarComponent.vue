<script setup lang="ts">
import { useWorkspacesStore } from "../../stores/workspaces.ts";
import { watch, ref, nextTick } from "vue";
const workspacesStore = useWorkspacesStore();

const isAddingWorkspace = ref(false);
const inputRef = ref(null);
const newWorkspaceTitle = ref("");

function startAdding() {
  isAddingWorkspace.value = true;
  nextTick(() => {
    inputRef.value && inputRef.value.focus();
  });
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
      <ul v-for="workspace in workspacesStore.workspaces">
        <li>{{ workspace.title }}</li>
      </ul>
      <input
        class="add-workspace-title"
        ref="inputRef"
        v-model="newWorkspaceTitle"
        v-if="!isAddingWorkspace"
      />
    </main>
    <footer>
      <button @click="startAdding()">+ Add workspace</button>
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
