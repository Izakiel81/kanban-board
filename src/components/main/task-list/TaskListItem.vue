<script setup lang="ts">
import { useElementDragAndDrop } from "../../../composables/useElementDragAndDrop";
import { useWorkspacesStore } from "../../../stores/workspaces";
import { useAppStatesStore } from "../../../stores/app_store";
import DeleteButton from "../ui/DeleteButton.vue";
import ModalDialog from "../ui/ModalDialog.vue";
import ModalDialogButton from "../ui/ModalDialogButton.vue";
import { type Card } from "../../../interfaces/Workspace";
import { ref, computed } from "vue";

const props = defineProps<{
  card: Card;
  cards: Array<Card>;
  currentTaskListId: string;
}>();

const appStates = useAppStatesStore();
const boardsStore = useWorkspacesStore();

const currentCard = computed(() => props.card);
const draggedOver = ref(false);
const isAbove = ref(false);
const elementHeight = ref(2);

const { startDrag, onDrop, dragEnter, dragLeave } = useElementDragAndDrop(
  currentCard,
  props.cards,
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
  if (!newCardTitle.value || !newCardTitle.value.trim()) return;
  boardsStore.editCard(
    appStates.currentBoardId,
    props.currentTaskListId,
    currentCard.value.id,
    newCard,
  );

  showModalDialog.value = false;
}

function deleteCard() {
  boardsStore.deleteItem(currentCard.value.id, props.cards);
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
          <textarea
            v-model="newCardTitle"
            @blur="modalDialogTitleEdit = false"
            @keyup.enter="modalDialogTitleEdit = false"
            v-else
          />
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
  position: relative;
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
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  justify-content: center;

  width: 22px;
  height: 21px;
  padding: 1px 3px 22px 3px;
  border-radius: 3px;

  background-color: #fff;

  transition: opacity 0.2s ease-out;
}
.delete-button:hover {
  background-color: #eee;
}
.delete-button:active {
  filter: brightness(90%);
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
  width: 93%;
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
