<script setup lang="ts"></script>
<template>
  <div class="container">
    <div class="title-container">
      <h2 class="title">
        <span><button class="title-button">Title</button></span>
      </h2>
    </div>
    <p>Content</p>
  </div>
</template>
<style scoped>
.container {
  padding: 5px;
  display: flex;
  flex-flow: wrap column;
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
</style>
