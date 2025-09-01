<script lang="ts" setup>
import TaskList from "./task-list/TaskList.vue";
</script>
<template>
  <div class="container">
    <TaskList />
    <div class="add-list-container">
      <h1>+ Add list</h1>
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

.add-list-container {
  display: flex;

  border: 2px dashed #ccc;
  border-radius: 8px;

  min-width: 250px;
  min-height: 70px;

  justify-content: center;
  align-items: center;

  text-align: center;

  user-select: none;

  cursor: pointer;
}
.add-list-container:hover {
  background-color: #cccccc69;
}
.add-list-container:active {
  filter: brightness(90%);
}
.add-list-container h1 {
  color: #ccc;
  font:
    500 20px/24px "Poppins",
    sans-serif;
}
</style>
