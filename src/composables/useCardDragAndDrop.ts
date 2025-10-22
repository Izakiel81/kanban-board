import { useDragAndDrop } from "./useDragAndDrop";
import { useCardsStore } from "../stores/cards";
import type { Card } from "../interfaces/Workspace";
import { ref, type Ref } from "vue";
export function useCardDragAndDrop(
  currentCard: Ref<Card>,
  draggedOver: Ref<boolean>,
  isAbove: Ref<boolean>,
  elementHeight: Ref<number>,
) {
  const cardsStore = useCardsStore();
  const { dragStart, swapItems } = useDragAndDrop();
  const counter = ref(0);

  function startDrag(event: DragEvent) {
    if (!event.dataTransfer) return;
    dragStart(event);
  }

  function onDrop(event: DragEvent) {
    if (!event.dataTransfer) return;
    const itemId = event.dataTransfer.getData("itemId");
    if (!itemId) return;
    const item = cardsStore.cards.find((item) => item.id === itemId);
    item && (item.taskListId = currentCard.value.taskListId);
    swapItems(cardsStore.cards, itemId, currentCard.value.id);
    onDragLeave();
  }

  function onDragEnter(event: DragEvent) {
    if (
      !event.dataTransfer ||
      !event.dataTransfer.getData("itemId") ||
      event.dataTransfer.getData("itemId") === currentCard.value.id
    )
      return;

    counter.value++;

    draggedOver.value = true;
    isAbove.value =
      parseInt(event.dataTransfer.getData("itemOrder")) >
        currentCard.value.order ||
      event.dataTransfer.getData("itemTaskListId") !==
        currentCard.value.taskListId;
    elementHeight.value = parseInt(event.dataTransfer.getData("height"));
  }

  function onDragLeave() {
    counter.value--;
    if (counter.value > 0) return;

    draggedOver.value = false;
    elementHeight.value = 2;
    counter.value = 0;
  }
  return {
    startDrag,
    onDrop,
    onDragEnter,
    onDragLeave,
  };
}
