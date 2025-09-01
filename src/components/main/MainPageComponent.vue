<script lang="ts" setup></script>
<template>
  <div class="container">
    <div class="board"></div>
    <div class="add-board-container"></div>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  gap: 10px;
}
.board {
  background-color: #0000005f;

  min-width: 230px;
  min-height: 50px;

  border-radius: 8px;
}
</style>
