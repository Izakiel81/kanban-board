<script setup lang="ts">
import { useCardsStore } from "../../../stores/cards";
import { type Card } from "../../../interfaces/Workspace";
import { ref, useTemplateRef } from "vue";
const props = defineProps<{ card: Card }>();

const currentCard = ref(props.card);
const dragIndicatorDown = useTemplateRef("dragIndicatorDown");

function onDragEnter(evt) {
  if (evt.dataTransfer.getData("itemId") === currentCard.value.id) return;
  const currComponent =
    parseInt(evt.dataTransfer.getData("itemOrder")) > currentCard.value.order
      ? evt.target
      : dragIndicatorDown.value;

  currComponent.style.width = evt.dataTransfer.getData("width") + "px";
  currComponent.style.height = evt.dataTransfer.getData("height") + "px";
  currComponent.className = currComponent.className + " dragged-on";
}

function onDragLeave(evt) {
  const currComponent =
    parseInt(evt.dataTransfer.getData("itemOrder")) > currentCard.value.order
      ? evt.target
      : dragIndicatorDown.value;
  currComponent.style.width = 100 + "%";
  currComponent.style.height = 2 + "px";
  currComponent.className = "";
  evt.target.className = "drag-target";
  dragIndicatorDown.value.className = "drag-indicator-down";
}
</script>

<template>
  <div class="wrapper">
    <span
      class="drag-target"
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
    />
    <div
      class="container"
      draggable="true"
      @dragstart="$emit('dragStart', $event, currentCard)"
    >
      <p class="content">{{ currentCard.title }}</p>
    </div>
    <span class="drag-indicator-down" ref="dragIndicatorDown" />
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

.drag-target {
  cursor: pointer;
  position: relative;

  height: 2px;
  width: 100%;

  margin: 3px 0;

  background-color: transparent;
}
.drag-target::before,
.drag-target::after {
  display: block;
  content: "";
  position: absolute;
  width: 100%;
  height: 13px;
  background-color: transparent;
}

.drag-target::before {
  top: -9px;
}
.drag-target::after {
  top: 2px;
}
.dragged-on {
  background-color: #555;
  border-radius: 6px;
  margin: 3px 0;
}
.drag-indicator-down {
  position: relative;
  top: 3px;
}
.content {
  user-select: none;
  font:
    400 16px/20px "Poppins",
    sans-serif;
  overflow-wrap: anywhere;
}
</style>
