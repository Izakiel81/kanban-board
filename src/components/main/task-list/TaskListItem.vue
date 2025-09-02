<script setup lang="ts"></script>
<template>
  <div class="container">
    <div class="title-container">
      <h2 class="title">
        <button class="title-button">Title</button>
      </h2>
    </div>
    <p class="content">Content</p>
  </div>
</template>
<style scoped>
.container {
  margin-bottom: 5px;

  display: flex;
  flex-flow: wrap column;

  gap: 2px;
}
.title-container {
  display: flex;
}
.title {
  width: 100%;
}
.title-button {
  width: 100%;
  text-align: left;
}
.content {
  color: #fff;
}
</style>
