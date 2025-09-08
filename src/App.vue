<script setup lang="ts">
import SidebarComponent from "./components/sidebar/SidebarComponent.vue";
import MainPageComponent from "./components/main/MainPageComponent.vue";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute();
const currentWorkspaceId = ref(route.params.id);
watch(
  () => route.params.id,
  (newId) => {
    currentWorkspaceId.value = newId;
  },
);
</script>

<template>
  <div id="container">
    <SidebarComponent :id="currentWorkspaceId" />
    <MainPageComponent :id="currentWorkspaceId" />
  </div>
</template>

<style>
#container {
  display: grid;
  grid-template-columns: 250px 1fr;
}
</style>
