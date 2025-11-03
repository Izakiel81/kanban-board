<script setup lang="ts">
import { ref } from "vue";
const { onClick, onCancel, wBackground } = defineProps<{
  onClick: (newTitle: string) => void;
  onClose: () => void;
  wBackground?: boolean;
}>();
const newItemTitle = ref<string>("");
</script>
<template>
  <div
    class="new-item-container"
    :style="{ backgroundColor: wBackground ? '#fff' : 'transparent' }"
  >
    <input v-model="newItemTitle" />
    <span class="new-item-container-buttons">
      <button
        @click="
          () => {
            onClick(newItemTitle);
            onClose();
          }
        "
      >
        Add
      </button>
      <span id="close" @click="onClose" />
    </span>
  </div>
</template>
<style scoped>
.new-item-container {
  display: flex;
  flex-direction: column;

  gap: 5px;

  padding: 5px;

  min-width: 250px;

  background-color: #0000005f;

  border-radius: 3px;
}
.new-item-container input {
  outline: none;

  border: 2px solid #fff;
  border-radius: 3px;

  padding: 2px 5px;

  transition: border-color 0.3s ease-out;
}

.new-item-container input:focus {
  border-color: #007bff;
}
.new-item-container-buttons {
  display: flex;
  align-items: center;
  gap: 5px;
}
.new-item-container-buttons button {
  cursor: pointer;

  padding: 6px 40px;

  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 2px;

  transition: filter 0.1s ease-in-out;
}
.new-item-container-buttons button:hover {
  filter: brightness(90%);
}
.new-item-container-buttons button:active {
  filter: brightness(80%);
}
#close {
  cursor: pointer;

  position: relative;
  user-select: none;

  height: 28px;
  width: 28px;
  padding: 6px 10px;

  border-radius: 5px;

  background-color: #555;

  transition: filter 0.1s ease-in-out;
}
#close:hover {
  filter: brightness(120%);
}
#close:active {
  filter: brightness(110%);
}
#close::before,
#close::after {
  content: "";
  position: absolute;
  width: 56%;
  top: 46%;
  left: 20%;
  border: 1px solid #aaa;
  border-radius: 5px;
}

#close::before {
  transform: rotate(45deg);
}
#close::after {
  transform: rotate(-45deg);
}
</style>
