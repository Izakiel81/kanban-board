<script setup lang="ts">
import ModalDialog from "./ModalDialog.vue";
import ModalDialogButton from "./ModalDialogButton.vue";
const { show, onCancel } = defineProps<{
  show: boolean;
  title: string;
  main: string;
  onCancel: () => void;
  onClick: () => void;
}>();
</script>
<template>
  <ModalDialog :show="show" :onCancel="onCancel" :footer="true">
    <template #header>{{ title }}</template>
    <template #default>{{ main }}</template>
    <template #footer>
      <ModalDialogButton @click.stop="onClick">Yes</ModalDialogButton>
      <ModalDialogButton :bgcolor="'#ff0000'" @click.stop="onCancel()"
        >Cancel</ModalDialogButton
      >
    </template>
  </ModalDialog>
</template>
<style scoped></style>
