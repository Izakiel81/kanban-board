<script setup lang="ts">
import ModalDialog from "./ModalDialog.vue";
import { useAppStatesStore } from "../../../stores/app_store";
import { useWorkspacesStore } from "../../../stores/workspaces";
import { useModalStore } from "../../../stores/modals_store";
import type { Card } from "../../../interfaces/Workspace";
import { ref, watch, nextTick } from "vue";

const { show, currentCard, onCancel } = defineProps<{
  show: boolean;
  currentCard: Card;
  onCancel: () => void;
}>();

const appStates = useAppStatesStore();
const boardsStore = useWorkspacesStore();
const modalStore = useModalStore();

const modalDialogTitleEdit = ref<boolean>(false);
const newCardTitle = ref<string>(currentCard.title);
const newCardDescription = ref<string>(currentCard.description || "");

const textareaRef = ref<HTMLElement | null>(null);

function autoResize() {
  if (!textareaRef.value) return;
  textareaRef.value.style.height = "auto";
  textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
}

function closeDialog() {
  if (!newCardTitle.value || !newCardTitle.value.trim()) return;
  const newCard = {
    ...currentCard,
    title: newCardTitle.value,
    description: newCardDescription.value,
  };
  boardsStore.editCard(
    appStates.currentBoardId,
    currentCard.taskListId,
    currentCard.id,
    newCard,
  );

  onCancel();

  modalStore.modalIsActive = false;
}
watch(modalDialogTitleEdit, async (isVisible) => {
  if (isVisible) {
    await nextTick();
    autoResize();
  }
});
</script>
<template>
  <ModalDialog :show="show" :onCancel="closeDialog">
    <template #header>
      <span class="container">
        <h2
          @click="modalDialogTitleEdit = true"
          v-if="!modalDialogTitleEdit"
          class="modal-dialog-title"
        >
          {{ newCardTitle }}
        </h2>
        <textarea
          class="title-textarea"
          maxLength="300"
          ref="textareaRef"
          @input="autoResize"
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
</template>

<style scoped>
.container {
  display: flex;
  width: 93%;
  height: 100%;
  overflow-y: auto;
}
.modal-dialog-title {
  flex: 1;
  word-break: break-word;
  font-size: 22px;
  font-weight: bold;
}
.title-textarea {
  resize: none;
  flex: 1;
  font-size: 22px;
  font-weight: bold;
}
.description-textarea {
  resize: none;
  font-size: 16px;
  width: 100%;
  padding: 8px;
  min-height: 250px;
  height: 100%;
}
</style>
