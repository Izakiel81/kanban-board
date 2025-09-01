<script setup lang="ts">
import SidebarComponent from "./components/sidebar/SidebarComponent.vue";
import MainPageComponent from "./components/main/MainPageComponent.vue";
</script>

<template>
  <div id="container">
    <SidebarComponent />
    <MainPageComponent />
  </div>
</template>

<style scoped>
#container {
  display: grid;
  grid-template-columns: 250px 1fr;
}
</style>
