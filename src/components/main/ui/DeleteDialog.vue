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
  <ModalDialog :show="show" :onCancel="onCancel" :footer="true">
    <template #header>{{ title }}</template>
    <template #default>{{ main }}</template>
    <template #footer>
      <ModalDialogButton @click.stop="click">Yes</ModalDialogButton>
      <ModalDialogButton :bgcolor="'#ff0000'" @click.stop="close"
        >Cancel</ModalDialogButton
      >
    </template>
  </ModalDialog>
</template>
<style scoped></style>
