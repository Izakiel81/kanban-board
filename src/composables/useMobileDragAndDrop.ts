import type { Card, TaskList, Workspace } from "../interfaces/Workspace.ts";
import { ref, type Ref } from "vue";
import { useDragAndDrop } from "./useDragAndDrop.ts";
import { useWorkspacesStore } from "../stores/workspaces.ts";
import { useAppStatesStore } from "../stores/app_store.ts";

const dropItem = ref<Workspace | TaskList | Card | null>(null);
const height = ref<number>(0);

export function useMobileDragAndDrop(
  currentElement: Ref<Workspace | TaskList | Card>,
  elements: Array<Workspace | TaskList | Card>,
  dataAttribute: string,
  isCardDragged?: Ref<boolean>,
) {
  const { transferCardsBetweenLists, changeItemOrder } = useDragAndDrop();
  const boardsStore = useWorkspacesStore();
  const appStore = useAppStatesStore();

  const currentIndicator = ref<HTMLElement | null>();

  function onDragEnter(targetElement: HTMLElement) {
    if (!dropItem.value) return;
    if (currentIndicator.value) onDragLeave();
    const indicatorId =
      dropItem.value.order < currentElement.value.order ? "up" : "down";

    currentIndicator.value = targetElement.querySelector(
      `#${indicatorId}`,
    ) as HTMLElement;

    if (currentElement.value.id === dropItem.value.id) return;
    if (isCardDragged) {
      isCardDragged.value =
        dropItem.value.type === "list" &&
        currentElement.value.type === "card" &&
        currentElement.value.taskListId !== dropItem.value.id;
    }
    if (
      dropItem.value.type !== currentElement.value.type &&
      !isCardDragged?.value
    )
      return;
    currentIndicator.value.classList.add("dragged-on");
    currentIndicator.value.style.height = `${height.value}px`;
  }
  function onDragLeave() {
    if (currentIndicator.value) {
      currentIndicator.value?.classList.remove("dragged-on");
      currentIndicator.value.style.height = "2px";
      currentIndicator.value = null;
    }
  }

  function onDragStart(element: HTMLElement) {
    height.value = element.getBoundingClientRect().height;
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

    const board = boardsStore.getBoardById(appStore.currentBoardId);
    if (!board) return;

    const elementBelow = document.elementFromPoint(clientX, clientY);
    const targetElement = elementBelow?.closest(`[${dataAttribute}]`);
    if (targetElement) {
      onDragEnter(targetElement as HTMLElement);
    }
    const listBelow = elementBelow?.closest(`[data-list-id]`);
    if (currentElement.value.type === "card" && listBelow) {
      const targetListId = listBelow.getAttribute("data-list-id");
      if (!targetListId) {
        return;
      }

      const targetList = boardsStore.getTaskListById(board, targetListId);
      if (!targetList) return;
      if (!targetElement) {
        if (targetList && targetList.id !== currentElement.value.taskListId) {
          dropItem.value = targetList;
          return;
        }
      } else {
        const targetId = targetElement.getAttribute(dataAttribute);
        const target = targetList.cards.find((item) => item.id === targetId);

        if (target && target.id !== currentElement.value.id) {
          dropItem.value = target;
          return;
        }
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
    onDragLeave();
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
      return;
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
      return;
    }

    changeItemOrder(elements, currentElement.value.id, dropItem.value.id);
  }

  return {
    onDragStart,
    onDrag,
    onDragEnd,
  };
}
