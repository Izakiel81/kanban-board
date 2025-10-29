<script setup lang="ts">
import { useElementDragAndDrop } from "../../../composables/useElementDragAndDrop";
import { useCardsStore } from "../../../stores/cards";
import DeleteButton from "../ui/DeleteButton.vue";
import ModalDialog from "../ui/ModalDialog.vue";
import ModalDialogButton from "../ui/ModalDialogButton.vue";
import { type Card } from "../../../interfaces/Workspace";
import { ref, computed } from "vue";

const props = defineProps<{ card: Card }>();

const cardsStore = useCardsStore();

const currentCard = computed(() => props.card);
const draggedOver = ref(false);
const isAbove = ref(false);
const elementHeight = ref(2);

const { startDrag, onDrop, dragEnter, dragLeave } = useElementDragAndDrop(
  currentCard,
  cardsStore.cards,
  draggedOver,
  isAbove,
  elementHeight,
);

const showModalDialog = ref(false);
const showDeleteDialog = ref(false);
const isMouseOver = ref(false);
const modalDialogTitleEdit = ref(false);
const newCardTitle = ref(currentCard.value.title || "");
const newCardDescription = ref(currentCard.value.description || "");

function closeDialog(newCard: Card) {
  if (!newCardTitle.value) return;
  cardsStore.editCard(newCard);

  showModalDialog.value = false;
}

function deleteCard() {
  cardsStore.deleteCard(currentCard.value.id);
  showDeleteDialog.value = false;
}
</script>

<template>
  <div
    class="wrapper"
    draggable="true"
    @dragstart.stop="startDrag($event)"
    @click="showModalDialog = true"
    @mouseover="isMouseOver = true"
    @mouseleave="isMouseOver = false"
    @dragover.prevent
    @dragenter.prevent.stop="dragEnter()"
    @dragleave.prevent.stop="dragLeave()"
    @drop.stop="onDrop()"
  >
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver && isAbove }"
      :style="{ height: draggedOver && isAbove ? elementHeight + 'px' : '2px' }"
      id="up"
    />
    <div class="container">
      <p class="content">{{ currentCard.title }}</p>
      <span class="delete-button" :style="{ opacity: isMouseOver ? 1 : 0 }">
        <DeleteButton
          :width="20"
          :height="20"
          @click.stop="() => (showDeleteDialog = true)"
        />
      </span>
    </div>
    <span
      class="drag-target"
      :class="{ 'dragged-on': draggedOver && !isAbove }"
      :style="{
        height: draggedOver && !isAbove ? elementHeight + 'px' : '2px',
      }"
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
        <ModalDialogButton :width="70" :height="30" @click.stop="deleteCard">
          Yes
        </ModalDialogButton>
        <ModalDialogButton
          :width="70"
          :bgcolor="'#ff0000'"
          @click.stop="() => (showDeleteDialog = false)"
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
  border-radius: 3px;
  padding: 4px 7px;

  cursor: pointer;
}

.drag-target {
  cursor: pointer;
  position: relative;

  height: 2px;
  width: 100%;

  background-color: transparent;

  transition:
    width 0.1s ease-out,
    height 0.1s ease-out;
}
.delete-button {
  transition: opacity 0.2s ease-out;
}
#up {
  top: -2px;
}
#down {
  top: 2px;
}
.dragged-on {
  background-color: #555;
  border-radius: 3px;
  margin: 3px 0;
}
.content {
  user-select: none;
  font:
    400 16px/23px "Poppins",
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
