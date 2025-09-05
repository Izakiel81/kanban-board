<script setup lang="ts">
import SidebarComponent from "./components/sidebar/SidebarComponent.vue";
import MainPageComponent from "./components/main/MainPageComponent.vue";
import { useRoute } from "vue-router";
import { watch, ref } from "vue";

const route = useRoute();
const currentWorkspaceId = ref(null);

watch(
  () => route.params.id,
  (newId, oldId) => {
    currentWorkspaceId.value = newId;
  },
);
</script>

<template>
  <div id="container">
    <SidebarComponent />
    <h1>{{ currentWorkspaceId }}</h1>
    <MainPageComponent />
  </div>
</template>

<style>
#container {
  display: grid;
  grid-template-columns: 250px 1fr;
}
</style>
