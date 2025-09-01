<script lang="ts" setup></script>
<template>
  <div class="container">
    <div class="board"></div>
    <div class="add-board-container">
      <h1>+ Add board</h1>
    </div>
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
.add-board-container {
  display: flex;

  border: 2px dashed #ccc;
  border-radius: 8px;

  min-width: 230px;
  min-height: 50px;

  justify-content: center;
  align-items: center;

  text-align: center;

  user-select: none;

  cursor: pointer;
}
.add-board-container:hover {
  background-color: #cccccc69;
}
.add-board-container:active {
  filter: brightness(90%);
}
.add-board-container h1 {
  color: #ccc;

  font-family: "Poppins", sans-serif;
  font-size: 20px;
}
</style>
