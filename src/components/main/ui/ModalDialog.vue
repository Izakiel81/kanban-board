<script setup lang="ts">
const { show, onCancel, width, height } = defineProps<{
  show: boolean;
  onCancel: () => void;
  width?: number;
  height?: number;
}>();
</script>
<template>
  <div class="overlay" v-if="show">
    <div
      class="wrapper"
      :style="{ width: width + 'px', height: height + 'px' }"
    >
      <header>
        <slot name="header"></slot>
        <span class="cancel" @click.stop="onCancel" />
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
  z-index: 1000;
}
.wrapper {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, 0);

  display: flex;
  flex-direction: column;
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
  gap: 10px;
  padding: 10px 10px 10px 15px;

  width: 100%;

  border-bottom: 1px solid #ccc;
}
main {
  overflow: auto;
  flex: 1;
  padding: 10px;
}
footer {
  padding: 5px 15px;
  border-top: 1px solid #ccc;

  display: flex;
  justify-content: flex-end;

  gap: 10px;
}
.cancel {
  cursor: pointer;
  position: relative;
  margin-right: 5px;
  border-radius: 100%;
  padding: 17px;
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
