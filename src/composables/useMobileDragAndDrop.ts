import type { Card, TaskList, Workspace } from "../interfaces/Workspace.ts";
import { ref, type Ref } from "vue";
import { useDragAndDrop } from "./useDragAndDrop.ts";
import { useWorkspacesStore } from "../stores/workspaces.ts";
import { useAppStatesStore } from "../stores/app_store.ts";

const dropItem = ref<Workspace | TaskList | Card | null>(null);

export function useMobileDragAndDrop(
  currentElement: Ref<Workspace | TaskList | Card>,
  elements: Array<Workspace | TaskList | Card>,
  dataAttribute: string,
) {
  const { transferCardsBetweenLists, changeItemOrder } = useDragAndDrop();
  const boardsStore = useWorkspacesStore();
  const appStore = useAppStatesStore();

  function onDragStart(element: HTMLElement) {
    element.style.width =
      element.getBoundingClientRect().width.toString() + "px";
    element.style.position = "fixed";
    element.style.opacity = "0.8";
  }

  function onDrag(e: TouchEvent, element: HTMLElement) {
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;

    element.style.top = (clientY + 5).toString() + "px";
    element.style.left = (clientX + 5).toString() + "px";

    const elementBelow = document.elementFromPoint(clientX, clientY);
    const targetElement = elementBelow?.closest(`[${dataAttribute}]`);
    const listBelow = elementBelow?.closest(`[data-list-id]`);
    if (currentElement.value.type === "card" && !targetElement && listBelow) {
      const targetListId = listBelow.getAttribute("data-list-id");
      const board = boardsStore.getBoardById(appStore.currentBoardId);
      if (!board || !targetListId) {
        return;
      }
      const targetList = boardsStore.getTaskListById(board, targetListId);
      if (!targetList) return;
      if (targetList && targetList.id !== currentElement.value.taskListId) {
        dropItem.value = targetList;
        return;
      }
    }

    if (targetElement) {
      const targetId = targetElement.getAttribute(dataAttribute);
      const target = elements.find((item) => item.id === targetId);

      if (target && target.id !== currentElement.value.id) {
        dropItem.value = target;
        return;
      }
    }
    dropItem.value = null;
  }
  function onDragEnd(element: HTMLElement) {
    element.style = "";
    if (!dropItem.value) return;
    if (dropItem.value.id === currentElement.value.id) return;

    if (
      currentElement.value.type === "card" &&
      dropItem.value.type === "card"
    ) {
      transferCardsBetweenLists(
        currentElement.value.id,
        dropItem.value.id,
        currentElement.value.taskListId,
        dropItem.value.taskListId,
      );
    }

    if (
      currentElement.value.type === "card" &&
      dropItem.value.type === "list"
    ) {
      const currentCardIndex = elements.findIndex(
        (item) => item.id === currentElement.value.id,
      );
      if (!currentCardIndex) return;

      elements.splice(currentCardIndex, 1);

      dropItem.value.cards.unshift(currentElement.value);
      dropItem.value.cards.forEach((item, index) => (item.order = index));

      currentElement.value.taskListId = dropItem.value.id;
    }
  }

  return {
    onDragStart,
    onDrag,
    onDragEnd,
  };
}
