import { type Ref } from "vue";
import type { Card, TaskList, Workspace } from "../interfaces/Workspace";
import { useWorkspacesStore } from "../stores/workspaces";
import { useAppStatesStore } from "../stores/app_store";

type Edge = "top" | "bottom" | "left" | "right";

export function useDragAndDrop() {
  const boardsStore = useWorkspacesStore();
  const appStore = useAppStatesStore();
  function dragStart(event: DragEvent, elementHeight: Ref<number>) {
    event.dataTransfer!.dropEffect = "move";
    event.dataTransfer!.effectAllowed = "move";

    const target = event.target as HTMLElement;
    elementHeight.value = target.getBoundingClientRect().height;
  }

  function computeDelta(
    distance: number,
    edegeType: Edge,
    maxSpeed = 20,
    threshold = 50,
  ) {
    const speed = Math.max(0, ((threshold - distance) / threshold) * maxSpeed);
    return edegeType === "top" || edegeType === "left" ? -speed : speed;
  }

  function dragScroll(
    parentElement: HTMLElement,
    pointer: { x: number; y: number },
  ) {
    const rect = parentElement.getBoundingClientRect();
    const threshold = 50;

    const distanceToTop = pointer.y - rect.top;
    const distanceToBottom = rect.bottom - pointer.y;
    const distanceToLeft = pointer.x - rect.left;
    const distanceToRight = rect.right - pointer.x;

    let deltaX = 0;
    let deltaY = 0;

    if (distanceToTop < threshold)
      deltaY = computeDelta(distanceToTop, "top", 20, threshold);
    if (distanceToBottom < threshold)
      deltaY = computeDelta(distanceToBottom, "bottom", 20, threshold);
    if (distanceToLeft < threshold)
      deltaX = computeDelta(distanceToLeft, "left", 20, threshold);
    if (distanceToRight < threshold)
      deltaX = computeDelta(distanceToRight, "right", 20, threshold);

    parentElement.scrollBy({ top: deltaY, left: deltaX, behavior: "smooth" });
  }

  function transferCardsBetweenLists(
    draggedCardId: string,
    dropCardId: string,
    draggedCardTaskListId: string,
    dropCardTaskListId: string,
  ) {
    const board = boardsStore.getBoardById(appStore.currentBoardId);
    if (!board) {
      console.error("Board is not found");
      return;
    }
    const dragList = boardsStore.getTaskListById(board, draggedCardTaskListId);
    const dropList = boardsStore.getTaskListById(board, dropCardTaskListId);

    if (!dragList || !dropList) {
      console.error(
        "List is undefined",
        "Drag list: ",
        dragList,
        "Drop list: ",
        dropList,
      );
      return;
    }

    const draggedCardIndex = dragList.cards.findIndex(
      (item) => item.id === draggedCardId,
    );
    const dropCardIndex = dropList.cards.findIndex(
      (item) => item.id === dropCardId,
    );

    if (draggedCardIndex === -1 || dropCardIndex === -1) {
      console.error(
        "Card is not found",
        "Dragged card index: ",
        draggedCardIndex,
        "Dragged card id",
        draggedCardId,
        "Drop card index: ",
        dropCardIndex,
        "Drop card id: ",
        dropCardId,
      );
      return;
    }

    const [item] = dragList.cards.splice(draggedCardIndex, 1);

    if (draggedCardTaskListId === dropCardTaskListId) {
      dragList.cards.splice(dropCardIndex, 0, item);
      dragList.cards.forEach((item, index) => (item.order = index));
    } else {
      dropList.cards.splice(dropCardIndex, 0, item);

      dropList.cards.forEach((item, index) => {
        item.order = index;
        item.taskListId = dropList.id;
      });
      dragList.cards.forEach((item, index) => {
        item.order = index;
        item.taskListId = dragList.id;
      });
    }
  }

  function changeItemOrder(
    list: Array<Workspace | TaskList | Card>,
    draggedItemId: string,
    dropItemId: string,
  ) {
    const draggedItemIndex = list.findIndex(
      (item) => item.id === draggedItemId,
    );
    const dropItemIndex = list.findIndex((item) => item.id === dropItemId);

    if (
      draggedItemIndex === -1 ||
      dropItemIndex === -1 ||
      draggedItemIndex === dropItemIndex
    )
      return;

    const [item] = list.splice(draggedItemIndex, 1);

    list.splice(dropItemIndex, 0, item);

    list.forEach((item, index) => {
      item.order = index;
    });
  }

  return {
    dragStart,
    changeItemOrder,
    transferCardsBetweenLists,
    dragScroll,
  };
}
