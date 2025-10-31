<script setup lang="ts">
import BurgerIcon from "./components/sidebar/BurgerIcon.vue";
import SidebarComponent from "./components/sidebar/SidebarComponent.vue";
import MainPageComponent from "./components/main/MainPageComponent.vue";
import { computed } from "vue";
import { useAppStatesStore } from "./stores/app_store.ts";
import { useWorkspacesStore } from "./stores/workspaces";

const appStates = useAppStatesStore();
const boardsStore = useWorkspacesStore();

const currentBoard = computed(() =>
  boardsStore.getBoardById(appStates.currentBoardId),
);
</script>

<template>
  <div id="container" :class="{ folded: !appStates.showSidebar }">
    <aside class="sidebar">
      <SidebarComponent />
    </aside>

    <main class="main">
      <div
        v-if="!appStates.showSidebar"
        class="burger-icon-container"
        @click.stop="
          () => {
            appStates.showSidebar = true;
          }
        "
      >
        <BurgerIcon />
      </div>
      <MainPageComponent v-if="currentBoard" :taskLists="currentBoard.lists" />
    </main>
  </div>
</template>

<style scoped>
#container {
  display: grid;
  grid-template-columns: auto 1fr;
  transition: grid-template-columns 0.3s ease;
  height: 100vh;
  background-color: #87c2fd;
}

.burger-icon-container {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 20px;
  height: 20px;
  margin: 10px 15px;
}

.sidebar {
  position: relative;
  left: 2px;
  width: 250px;
  overflow: hidden;
  transition:
    width 0.3s ease,
    opacity 0.3s ease;
  align-self: center;
}

.folded .sidebar {
  width: 0;
  opacity: 0;
}

.main {
  overflow-wrap: break-word;
  transition: padding 0.3s ease;
}
</style>
