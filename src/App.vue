<script setup lang="ts">
import BurgerIcon from "./components/sidebar/BurgerIcon.vue";
import SidebarComponent from "./components/sidebar/SidebarComponent.vue";
import MainPageComponent from "./components/main/MainPageComponent.vue";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

const route = useRoute();
const currentWorkspaceId = computed(() => route.params.id as string);

const sidebarFolded = ref(false);
</script>

<template>
  <div id="container" :class="{ folded: sidebarFolded }">
    <aside class="sidebar">
      <SidebarComponent @fold="sidebarFolded = true" />
    </aside>

    <main class="main">
      <div
        v-if="sidebarFolded"
        class="burger-icon-container"
        @click.stop="
          () => {
            sidebarFolded = false;
          }
        "
      >
        <BurgerIcon />
      </div>
      <MainPageComponent
        v-if="currentWorkspaceId"
        :workspace_id="currentWorkspaceId"
      />
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
