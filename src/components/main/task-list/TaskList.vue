<script setup lang="ts">
import TaskListItem from "./TaskListItem.vue";
import { ref } from "vue";

const isEditingTitle = ref(true);
</script>

<template>
  <div class="list">
    <div class="title-container">
      <h2 class="title" v-if="!isEditingTitle">
        <button class="title-button" @click="isEditingTitle = true">
          Title
        </button>
      </h2>
      <textarea
        aria-multiline="true"
        class="title-textarea"
        v-else
        @blur="isEditingTitle = false"
      ></textarea>
    </div>
    <TaskListItem />
    <button class="list-add">+ Add Card</button>
  </div>
</template>

<style scoped>
.title-container {
  display: flex;
  margin-bottom: 5px;
}
.title {
  width: 100%;
}
.title-button {
  width: 100%;
  text-align: left;

  background-color: transparent;
  border: none;
  padding: 5px 2px;
  font-size: 18px;
}
.title-textarea {
  width: 100%;
  height: 24px;

  resize: none;

  padding: 0 3px;
  font-size: 18px;
  overflow-wrap: break-word;
  overflow: hidden;
}
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
