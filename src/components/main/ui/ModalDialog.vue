<script setup lang="ts">
import { toRefs } from "vue";
const props = defineProps<{
  show: boolean;
  onCancel: () => void;
  width?: number;
  height?: number;
}>();
const { show, onCancel } = toRefs(props);
</script>
<template>
  <div class="overlay" v-if="show">
    <div class="wrapper" :width="width + 'px'" :height="height + 'px'">
      <header>
        <slot name="header"></slot>
        <span class="cancel" @click="onCancel" />
      </header>
      <main>
        <slot name="default"></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
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
  top: 15%;
  left: 50%;
  transform: translate(-50%, 0);

  width: 500px;
  min-height: 200px;

  background-color: #fff;

  border-radius: 8px;

  font-family: "Poppins", sans-serif;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 10px 15px;

  width: 100%;

  border-bottom: 1px solid #ccc;
}
main {
  overflow: auto;
  padding: 10px;
  min-height: 250px;
}
footer {
  padding: 5px 15px;
  border-top: 1px solid #ccc;
}
.cancel {
  cursor: pointer;
  position: relative;
  margin-right: 5px;
  border-radius: 100%;
  width: 35px;
  height: 35px;
  transition:
    background-color 0.1s ease,
    filter 0.1s ease-out;
}

.cancel:hover {
  background-color: #eee;
}

.cancel:active {
  filter: brightness(90%);
}

.cancel::before,
.cancel::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  border: 2px solid #aaa;
  border-radius: 2px;
  width: 17px;
}
.cancel::before {
  transform: translate(-50%, -50%) rotate(45deg);
}
.cancel::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
