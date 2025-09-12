<script setup lang="ts">
import { toRefs } from "vue";
const props = defineProps<{ show: boolean; onCancel: () => void }>();
const { show, onCancel } = toRefs(props);
</script>
<template>
  <div class="overlay" v-if="show">
    <div class="wrapper">
      <header>
        <slot name="header"></slot>
        <span class="cancel" @click="onCancel" />
      </header>
      <slot name="default"></slot>
    </div>
  </div>
</template>
<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  background-color: #00000045;
}
.wrapper {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 500px;
  min-height: 200px;

  background-color: #fff;

  border-radius: 8px;
}
</style>
