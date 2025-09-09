<script setup lang="ts">
import { useCardsStore } from "../../../stores/cards";
</script>

<template>
  <div class="container">
    <p class="content">Content</p>
  </div>
</template>
<style scoped>
.container {
  margin-bottom: 5px;

  display: flex;
  flex-flow: wrap column;

  gap: 2px;
  background-color: #fff;
  border-radius: 6px;
  padding: 4px 7px;
}

.content {
  font:
    400 16px/20px "Poppins",
    sans-serif;
}
</style>
