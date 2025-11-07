<script setup lang="ts">
import { ref } from "vue";

interface Item {
  title: string;
  onClick: () => void;
}

const { items } = defineProps<{ items: Array<Item> }>();
</script>
<template>
  <div class="container">
    <span class="dots" />
    <div class="items-container">
      <span
        class="item"
        v-for="item in items"
        @click.prevent.stop="item.onClick"
        >{{ item.title }}</span
      >
    </div>
  </div>
</template>
<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
}

.items-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 2;
  top: 15px;
  left: -60px;
  width: 70px;

  background-color: #3e3e3e;
  color: #fff;
  border-radius: 5px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2px 5px;
}
.item:active {
  filter: brightness(1.2);
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
