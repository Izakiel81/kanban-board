<script setup lang="ts">
import DragAndDropContainer from "../../DragAndDropContainer.vue";
import { useElementDragAndDrop } from "../../../composables/useElementDragAndDrop";
import { useMobileDragAndDrop } from "../../../composables/useMobileDragAndDrop";
import { useWorkspacesStore } from "../../../stores/workspaces";
import { useAppStatesStore } from "../../../stores/app_store";
import { useModalStore } from "../../../stores/modals_store";
import DeleteButton from "../ui/DeleteButton.vue";
import DeleteDialog from "../../main/ui/DeleteDialog.vue";
import EditCardDialog from "../../main/ui/EditCardDialog.vue";
import { type Card } from "../../../interfaces/Workspace";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps<{
  card: Card;
  cards: Array<Card>;
}>();

const boardsStore = useWorkspacesStore();
const modalStore = useModalStore();

const showModalDialog = ref(false);
const showDeleteDialog = ref(false);
const isMouseOver = ref(false);

function deleteCard() {
  boardsStore.deleteItem(currentCard.value.id, props.cards);
}
function openDialog() {
  if (modalStore.modalIsActive) return;
  showModalDialog.value = true;
  modalStore.modalIsActive = true;
}
</script>

<template>
  <DragAndDropContainer
    :dataAttribute="'data-card-id'"
    :elements="props.cards"
    :element="props.card"
    :mouseOver="() => (isMouseOver = true)"
    :mouseLeave="() => (isMouseOver = false)"
    :onClick="openDialog"
  >
    <div class="container">
      <p class="content">{{ props.card.title }}</p>
      <span class="delete-button" :style="{ opacity: isMouseOver ? 1 : 0 }">
        <DeleteButton
          :width="20"
          :height="20"
          @click.stop="
            () => {
              showDeleteDialog = true;
              modalStore.modalIsActive = true;
            }
          "
        />
      </span>
    </div>
    <EditCardDialog
      :show="showModalDialog"
      :currentCard="props.card"
      :onCancel="() => (showModalDialog = false)"
    />
    <DeleteDialog
      :show="showDeleteDialog"
      :title="'Are you sure you want to delete this card?'"
      :main="props.card.title"
      :onCancel="() => (showDeleteDialog = false)"
      :onClick="deleteCard"
    />
  </DragAndDropContainer>
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
</style>
