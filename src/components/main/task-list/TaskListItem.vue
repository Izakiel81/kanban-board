<script setup lang="ts">
import { useCardsStore } from "../../../stores/cards";
import { type Card } from "../../../interfaces/Workspace";
import { ref } from "vue";
const props = defineProps<{ card: Card }>();

const currentCard = ref(props.card);

function onDragEnter(evt) {
  console.log(evt.dataTransfer.getData("itemId") === currentCard.value.id);
  if (evt.dataTransfer.getData("itemId") === currentCard.value.id) return;
  evt.target.style.width = evt.dataTransfer.getData("width") + "px";
  evt.target.style.height = evt.dataTransfer.getData("height") + "px";
  evt.target.className = "add-button dragged-on";
}

function onDragLeave(evt) {
  evt.target.style.width = 100 + "%";
  evt.target.style.height = 2 + "px";
  evt.target.className = "add-button";
}
</script>

<template>
  <div class="wrapper">
    <span
      class="add-button"
      @dragenter="onDragEnter($event)"
      @dragleave="onDragLeave($event)"
      @dragover.prevent
      @drop="
        (event) => {
          if (event.dataTransfer.getData('itemId') === currentCard.id) return;
          onDragLeave(event);
          $emit('emitDrop', event, currentCard.id);
        }
      "
    ></span>
    <div
      class="container"
      draggable="true"
      @dragstart="$emit('dragStart', $event, currentCard)"
    >
      <p class="content">{{ currentCard.title }}</p>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}
.container {
  display: flex;
  flex-flow: wrap column;

  gap: 2px;
  background-color: #fff;
  border-radius: 6px;
  padding: 4px 7px;
}

.add-button {
  cursor: pointer;
  position: relative;

  height: 2px;
  width: 100%;

  padding: 4px 0;

  background-color: transparent;
}
.add-button::before,
.add-button::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.add-button::before {
  top: -8px;
}
.add-button::after {
  top: 8px;
}
.dragged-on {
  background-color: #555;
  border-radius: 6px;
  margin: 5px 0;
}
.content {
  user-select: none;
  font:
    400 16px/20px "Poppins",
    sans-serif;
  overflow-wrap: anywhere;
}
</style>
