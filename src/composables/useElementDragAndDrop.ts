import { ref, type Ref } from "vue";
import type { Card, TaskList, Workspace } from "../interfaces/Workspace";
import { useDragAndDrop } from "./useDragAndDrop";
import { useCardsStore } from "../stores/cards";

const draggedElement = ref<Workspace | TaskList | Card | null>(null);
const height = ref<number>(0);

export function useElementDragAndDrop(
  currentElement: Ref<Workspace | TaskList | Card>,
  elements: Array<Workspace | TaskList | Card>,
  draggedOver: Ref<boolean>,
  isAbove: Ref<boolean>,
  elementHeight: Ref<number>,
  isCardDragged?: Ref<boolean>,
) {
  const { dragStart, swapItems } = useDragAndDrop();

  const cardsStore = useCardsStore();

  const counter = ref<number>(0);
  function startDrag(event: DragEvent) {
    if (!event.dataTransfer) return;
    dragStart(event, height);
    draggedElement.value = currentElement.value;
  }

  function onDrop() {
    if (!draggedElement.value) return;
    if (
      draggedElement.value.type === "card" &&
      currentElement.value.type === "list"
    ) {
      const item = cardsStore.cards.find(
        (item) => item.id === draggedElement.value!.id,
      );
      item && (item.taskListId = currentElement.value.id);
      dragLeave();
      return;
    }
    if (draggedElement.value.type !== currentElement.value.type) return;

    swapItems(elements, draggedElement.value.id, currentElement.value.id);
    dragLeave();
  }

  function dragEnter() {
    if (!draggedElement.value) return;
    counter.value++;
    if (draggedElement.value.id === currentElement.value.id) return;
    isCardDragged &&
      (isCardDragged.value =
        draggedElement.value.type === "card" &&
        currentElement.value.type === "list");
    if (
      draggedElement.value.type !== currentElement.value.type &&
      !isCardDragged?.value
    )
      return;
    draggedOver.value = !isCardDragged?.value;
    isAbove.value = draggedElement.value.order > currentElement.value.order;
    elementHeight.value = height.value;
  }

  function dragLeave() {
    counter.value--;
    if (counter.value > 0) return;
    counter.value = 0;
    draggedOver.value = false;
    elementHeight.value = 0;
    isCardDragged && (isCardDragged.value = false);
  }
  return { startDrag, onDrop, dragEnter, dragLeave };
}
