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

const showModalDialog = ref(false);
const showDeleteDialog = ref(false);
const modalDialogTitleEdit = ref(false);
const elementHeight = ref(2);
const newCardTitle = ref(currentCard.value.title || "");
const newCardDescription = ref(currentCard.value.description || "");

const draggedOver = ref(false);
const isAbove = ref(false);

let counter = 0;

function closeDialog(newCard: Card) {
  emit("editCard", newCard);

  showModalDialog.value = false;
}

function deleteCard() {
  emit("deleteCard", currentCard.id);

  showDeleteDialog.value = false;
}

function onDragEnter(evt) {
  if (
    !evt.dataTransfer.getData("itemId") ||
    evt.dataTransfer.getData("itemId") === currentCard.value.id
  )
    return;

  counter++;

  draggedOver.value = true;
  isAbove.value =
    parseInt(evt.dataTransfer.getData("itemOrder")) > currentCard.value.order ||
    evt.dataTransfer.getData("itemTaskListId") !== currentCard.value.taskListId;
  elementHeight.value = parseInt(evt.dataTransfer.getData("height"));
}

function onDragLeave(evt) {
  counter--;
  if (counter > 0) return;

  draggedOver.value = false;
  elementHeight.value = 2;
  counter = 0;
}
</script>

<template>
  <div
    class="wrapper"
    draggable="true"
    @dragstart.stop="emit('dragStart', $event, currentCard)"
    @click="showModalDialog = true"
    @dragover.prevent
    @dragenter.prevent.stop="onDragEnter($event)"
    @dragleave.prevent.stop="onDragLeave($event)"
    @drop.stop="
      (event) => {
        if (event.dataTransfer.getData('itemId') === currentCard.id) return;
        onDragLeave(event);
        emit('emitDrop', event, currentCard.id);
      }
    "
  >
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver & isAbove }"
      :style="{ height: draggedOver & isAbove ? elementHeight + 'px' : '2px' }"
      id="up"
    />
    <div class="container">
      <p class="content">{{ currentCard.title }}</p>
      <DeleteButton
        :width="20"
        :height="20"
        :onClick="() => (showDeleteDialog = true)"
      />
    </div>
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver & !isAbove }"
      :style="{ height: draggedOver & !isAbove ? elementHeight + 'px' : '2px' }"
      id="down"
    />
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
          <h2
            @click="modalDialogTitleEdit = true"
            v-if="!modalDialogTitleEdit"
            class="modal-dialog-title"
          >
            {{ newCardTitle }}
          </h2>
          <textarea v-model="newCardTitle" v-else />
        </span>
      </template>
      <template #default>
        <textarea class="description-textarea" v-model="newCardDescription" />
      </template>
    </ModalDialog>
    <ModalDialog
      :show="showDeleteDialog"
      :onCancel="() => (showDeleteDialog = false)"
    >
      <template #header>
        <h3>Are you sure you want to delete this card?</h3>
      </template>
      <template #default>
        <h2>{{ currentCard.title }}</h2>
        <p>{{ currentCard.description }}</p>
      </template>
      <template #footer>
        <ModalDialogButton :width="70" :height="30" :onClick="deleteCard">
          Yes
        </ModalDialogButton>
        <ModalDialogButton
          :width="70"
          :bgcolor="'#ff0000'"
          :onClick="() => (showDeleteDialog = false)"
        >
          Cancel
        </ModalDialogButton>
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

  background-color: transparent;
}
#up {
  top: -2px;
}
#down {
  top: 2px;
}
.dragged-on {
  background-color: #555;
  border-radius: 6px;
  margin: 3px 0;
}
.content {
  user-select: none;
  font:
    400 16px/20px "Poppins",
    sans-serif;
  overflow-wrap: anywhere;
}
.modal-dialog-title {
  word-break: break-word;
}
.description-textarea {
  resize: none;
  font-size: 16px;
  width: 100%;
  padding: 8px;
  min-height: 250px;
}
</style>
