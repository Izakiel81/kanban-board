<script lang="ts" setup></script>
<template>
  <div class="container">
    <div class="board">
      <button class="board-add">+ Add</button>
    </div>
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

  padding: 3px;

  border-radius: 8px;
}
.board-add {
  cursor: pointer;

  width: 100%;
  height: 20px;

  border: none;
  border-radius: 5px;

  color: #fff;
  background-color: transparent;
}
.board-add:hover {
  border: 1px solid #fff;
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
  font:
    500 20px/24px "Poppins",
    sans-serif;
}
</style>
