<script setup lang="ts">
import { ref } from "vue";
const showContextMenu = ref(false);
</script>
<template>
  <div class="container">
    <span class="dots" />
  </div>
</template>
<style scoped>
.container {
  position: relative;
}
.dots {
  display: flex;
  width: 10px;
  height: 10px;
}
</style>
