<script setup lang="ts"></script>

<template>
  <div class="list">
    <button class="list-add">+ Add</button>
  </div>
</template>

<style scoped>
.list {
  background-color: #0000005f;

  min-width: 230px;
  min-height: 50px;

  padding: 10px;

  border-radius: 8px;
}
.list-add {
  cursor: pointer;

  width: 100%;
  height: 50px;

  border: 1px solid #ffffff7f;
  border-radius: 5px;

  color: #fff;
  background-color: transparent;
}
.list-add:hover {
  filter: brightness(80%);
}
</style>
