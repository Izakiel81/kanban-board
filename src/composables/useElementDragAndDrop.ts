import { ref, type Ref } from "vue";
import type { Card, TaskList, Workspace } from "../interfaces/Workspace";
import { useDragAndDrop } from "./useDragAndDrop";
import { useAppStatesStore } from "../stores/app_store";
import { useWorkspacesStore } from "../stores/workspaces";
import { useDragScroll } from "./useDragScroll";

const draggedElement = ref<Workspace | TaskList | Card | null>(null);
const height = ref<number>(0);

const THRESHOLD = 200;
const MAX_SPEED = 60;

export function useElementDragAndDrop(
  currentElement: Ref<Workspace | TaskList | Card>,
  parentElement: Ref<HTMLElement | null> | undefined,
  elements: Array<Workspace | TaskList | Card>,
  draggedOver: Ref<boolean>,
  isAbove: Ref<boolean>,
  elementHeight: Ref<number>,
  isCardDragged?: Ref<boolean>,
) {
  const { dragStart, changeItemOrder, transferCardsBetweenLists } =
    useDragAndDrop();

  const { scrollDrag, stopScrollAnimation } = useDragScroll(
    parentElement,
    THRESHOLD,
    MAX_SPEED,
  );

  const appStore = useAppStatesStore();
  const boardsStore = useWorkspacesStore();

  const counter = ref<number>(0);
  function startDrag(event: DragEvent) {
    if (!event.dataTransfer) return;
    dragStart(event, height);
    draggedElement.value = currentElement.value;
  }

  function onDrop() {
    dragLeave();
    if (!draggedElement.value) return;
    if (
      draggedElement.value.type === "card" &&
      currentElement.value.type === "list"
    ) {
      if (draggedElement.value.taskListId === currentElement.value.id) return;
      const board = boardsStore.getBoardById(appStore.currentBoardId);
      if (!board) return;

      const originalCards = boardsStore.getTaskListById(
        board,
        draggedElement.value.taskListId,
      );
      if (!originalCards) return;

      const cardIndex = originalCards.cards.findIndex(
        (item) => item.id === draggedElement.value!.id,
      );
      if (cardIndex === -1) return;

      originalCards.cards.splice(cardIndex, 1);
      originalCards.cards.forEach((item, index) => (item.order = index));

      currentElement.value.cards.unshift(draggedElement.value);
      currentElement.value.cards.forEach((item, index) => {
        item.order = index;
      });
      draggedElement.value.taskListId = currentElement.value.id;
      return;
    }

    if (
      draggedElement.value.type === "card" &&
      currentElement.value.type === "card"
    ) {
      transferCardsBetweenLists(
        draggedElement.value.id,
        currentElement.value.id,
        draggedElement.value.taskListId,
        currentElement.value.taskListId,
      );
      return;
    }
    if (draggedElement.value.type === currentElement.value.type) {
      changeItemOrder(
        elements,
        draggedElement.value.id,
        currentElement.value.id,
      );
      return;
    }
  }

  function drag(event: DragEvent) {
    const clientX = event.clientX;
    const clientY = event.clientY;

    scrollDrag({ x: clientX, y: clientY });
  }

  function dragEnter() {
    if (!draggedElement.value) return;
    counter.value++;
    if (draggedElement.value.id === currentElement.value.id) return;
    if (isCardDragged) {
      isCardDragged.value =
        draggedElement.value.type === "card" &&
        currentElement.value.type === "list" &&
        draggedElement.value.taskListId !== currentElement.value.id;
    }
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
    stopScrollAnimation();
    counter.value = 0;
    draggedOver.value = false;
    elementHeight.value = 0;
    isCardDragged && (isCardDragged.value = false);
  }
  return { startDrag, onDrop, dragEnter, drag, dragLeave };
}
