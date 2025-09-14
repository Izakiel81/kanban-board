<script setup lang="ts">
import { useCardsStore } from "../../../stores/cards";
import DeleteButton from "../ui/DeleteButton.vue";
import ModalDialog from "../ui/ModalDialog.vue";
import ModalDialogButton from "../ui/ModalDialogButton.vue";
import { type Card } from "../../../interfaces/Workspace";
import { ref, computed, useTemplateRef } from "vue";

const props = defineProps<{ card: Card }>();
const emit = defineEmits(["editCard", "dragStart", "emitDrop"]);

const currentCard = computed(() => props.card);
const dragIndicatorDown = useTemplateRef("dragIndicatorDown");

const showModalDialog = ref(false);
const showDeleteDialog = ref(true);
const modalDialogTitleEdit = ref(false);
const newCardTitle = ref(currentCard.value.title || "");
const newCardDescription = ref(currentCard.value.description || "");

function closeDialog(newCard: Card) {
  emit("editCard", newCard);

  showModalDialog.value = false;
}

function deleteCard() {
  emit("deleteCard", currentCard.id);

  showDeleteDialog.value = false;
}

function onDragEnter(evt) {
  if (evt.dataTransfer.getData("itemId") === currentCard.value.id) return;
  const currComponent =
    parseInt(evt.dataTransfer.getData("itemOrder")) > currentCard.value.order ||
    evt.dataTransfer.getData("itemTaskListId") !== currentCard.value.taskListId
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
  <div class="wrapper" @click="showModalDialog = true">
    <span
      class="drag-target"
      @dragenter="onDragEnter($event)"
      @dragleave="onDragLeave($event)"
      @dragover.prevent
      @drop="
        (event) => {
          if (event.dataTransfer.getData('itemId') === currentCard.id) return;
          onDragLeave(event);
          emit('emitDrop', event, currentCard.id);
        }
      "
    />
    <div
      class="container"
      draggable="true"
      @dragstart="emit('dragStart', $event, currentCard)"
    >
      <p class="content">{{ currentCard.title }}</p>
      <span><DeleteButton :width="20" :height="20" /></span>
    </div>
    <span class="drag-indicator-down" ref="dragIndicatorDown" />
    <ModalDialog
      :show="showModalDialog"
      :onCancel="
        () =>
          closeDialog({
            ...currentCard,
            title: newCardTitle,
            description: newCardDescription,
          })
      "
    >
      <template #header>
        <span>
          <h2 @click="modalDialogTitleEdit = true" v-if="!modalDialogTitleEdit">
            {{ newCardTitle }}
          </h2>
          <textarea v-model="newCardTitle" v-else />
        </span>
      </template>
      <template #default>
        <textarea class="description-textarea" v-model="newCardDescription" />
      </template>
    </ModalDialog>
    <ModalDialog :show="true" :onCancel="showDeleteDialog = false">
      <template #header>
        <h3>Are you sure you want to delete this card?</h3>
      </template>
      <template #default>
        <h2>{{ currentCard.title }}</h2>
        <p>{{ currentCard.description }}</p>
      </template>
      <template #footer>
        <ModalDialogButton :width="60" :height="20">Yes</ModalDialogButton>
        <ModalDialogButton>Cancel</ModalDialogButton>
      </template>
    </ModalDialog>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}
.container {
  display: flex;
  justify-content: space-between;

  gap: 2px;
  background-color: #fff;
  border-radius: 6px;
  padding: 4px 7px;

  cursor: pointer;
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

  height: 2px;
  width: 100%;

  top: 3px;
}
.content {
  user-select: none;
  font:
    400 16px/20px "Poppins",
    sans-serif;
  overflow-wrap: anywhere;
}

.description-textarea {
  resize: none;
  font-size: 16px;
  width: 100%;
  padding: 8px;
  min-height: 250px;
}
</style>
