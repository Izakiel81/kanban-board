<script setup lang="ts">
import ModalDialog from "./ModalDialog.vue";
import ModalDialogButton from "./ModalDialogButton.vue";
import { useModalStore } from "../../../stores/modals_store";

const modalStates = useModalStore();
const { show, onCancel } = defineProps<{
  show: boolean;
  title: string;
  main: string;
  onCancel: () => void;
  onClick: () => void;
}>();

function close() {
  modalStates.modalIsActive = false;
  onCancel();
}
function click() {
  onClick();
  close();
}
</script>
<template>
  <ModalDialog :width="550" :show="show" :onCancel="onCancel" :footer="true">
    <template #header>
      <h2 class="title">{{ title }}</h2>
    </template>
    <template #default>
      <p class="main-text">{{ main }}</p>
    </template>
    <template #footer>
      <ModalDialogButton :width="100" @click.stop="click">
        Yes
      </ModalDialogButton>
      <ModalDialogButton :width="100" :bgcolor="'#ff0000'" @click.stop="close">
        Cancel
      </ModalDialogButton>
    </template>
  </ModalDialog>
</template>
<style scoped>
.title {
  font-size: 21px;
  word-break: break-word;
}
.main-text {
  overflow-y: auto;
  word-break: break-word;
}
</style>
