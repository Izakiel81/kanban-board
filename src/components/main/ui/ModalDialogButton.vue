<script setup lang="ts">
const { width, height, bgcolor, tcolor } = defineProps<{
  bgcolor?: string;
  tcolor?: string;
  width?: number;
  height?: number;
}>();
</script>
<template>
  <button
    :style="{
      color: tcolor,
      backgroundColor: bgcolor,
      width: width ? width + 'px' : 'auto',
      height: height ? height + 'px' : 'auto',
    }"
  >
    <slot>Button</slot>
  </button>
</template>
<style scoped>
button {
  cursor: pointer;
  border-radius: 5px;
  border: none;

  padding: 5px 10px;

  color: white;
  background-color: #21a5f5;

  transition: filter 0.1s ease-out;
}
button:hover {
  filter: brightness(90%);
}
button:active {
  filter: brightness(85%);
}
</style>
