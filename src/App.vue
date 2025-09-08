<script setup lang="ts">
import SidebarComponent from "./components/sidebar/SidebarComponent.vue";
import MainPageComponent from "./components/main/MainPageComponent.vue";
import { useRoute } from "vue-router";
import { computed, watch } from "vue";

const route = useRoute();
const currentWorkspaceId = computed(() => route.params.id);
</script>

<template>
  <div id="container">
    <SidebarComponent :id="currentWorkspaceId" />
    <MainPageComponent v-if="currentWorkspaceId" :id="currentWorkspaceId" />
  </div>
</template>

<style>
#container {
  display: grid;
  grid-template-columns: 250px 1fr;
}
</style>
