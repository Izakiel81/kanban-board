import { useDragAndDrop } from "./useDragAndDrop";
import { useCardsStore } from "../stores/cards";
import type { Card } from "../interfaces/Workspace";
import type { Ref } from "vue";
export function useCardDragAndDrop(currentCard: Ref<Card>) {
  const cardsStore = useCardsStore();
  const { dragStart, swapItems } = useDragAndDrop();
  function startDrag(event: DragEvent) {
    if (!event.dataTransfer) return;
    dragStart(event);
    event.dataTransfer.setData("itemId", currentCard.value.id);
    event.dataTransfer.setData("itemOrder", currentCard.value.order.toString());
    event.dataTransfer.setData("itemTaskListId", currentCard.value.taskListId);
  }

  return {
    startDrag,
  };
}
