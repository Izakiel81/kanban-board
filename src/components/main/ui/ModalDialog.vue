<script setup>
import { useRefs } from 'vue';
const props = defineProps<{show: boolean}>();
const { show } = useRefs(props);
</script>
<template>
  <div class="overlay" v-if="show">
    <div class="wrapper">
      <slot></slot>
    </div>
  </div>
</template>
<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  opacity: 0.5;
  background-color: #000;
}
</style>
