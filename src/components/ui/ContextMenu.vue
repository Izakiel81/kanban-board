<script setup lang="ts">
import { ref } from "vue";

interface Item {
  title: string;
  onClick: () => void;
}

const showContextMenu = ref(false);

const { items } = defineProps<{ items: Array<Item> }>();
</script>
<template>
  <div class="container">
    <span class="dots" />
  </div>
</template>
<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
}
.dots {
  position: relative;
  width: 5px;
  height: 5px;

  background-color: #3e3e3e;
  border-radius: 100%;
}

.dots::before,
.dots::after {
  content: "";
  position: absolute;
  right: 8px;
  width: 5px;
  height: 5px;

  background-color: #3e3e3e;
  border-radius: 100%;
}
.dots::after {
  right: 16px;
}
</style>
