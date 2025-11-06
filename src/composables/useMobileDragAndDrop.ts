import type { Card, TaskList, Workspace } from "../interfaces/Workspace.ts";
import { ref, type Ref } from "vue";
import { useDragAndDrop } from "./useDragAndDrop.ts";
import { useWorkspacesStore } from "../stores/workspaces.ts";
import { useAppStatesStore } from "../stores/app_store.ts";

const dropItem = ref<Workspace | TaskList | Card | null>(null);
const height = ref<number>(0);
const width = ref<number>(0);

export function useMobileDragAndDrop(
  currentElement: Ref<Workspace | TaskList | Card>,
  parentElement: Ref<HTMLElement | null>,
  elements: Array<Workspace | TaskList | Card>,
  dataAttribute: string,
  horizontal?: boolean,
) {
  const { transferCardsBetweenLists, changeItemOrder } = useDragAndDrop();
  const boardsStore = useWorkspacesStore();
  const appStore = useAppStatesStore();

  const currentIndicator = ref<HTMLElement | null>();
  const cardToList = ref<boolean>(false);

  function onDragEnter(targetElement: HTMLElement, listBelow: HTMLElement) {
    if (!dropItem.value) return;
    if (currentIndicator.value) onDragLeave();
    if (currentElement.value.id === dropItem.value.id) return;

    if (targetElement) {
      if (horizontal) {
        const indicatorId =
          dropItem.value.order < currentElement.value.order ? "left" : "right";
        currentIndicator.value = targetElement.querySelector(
          `#${indicatorId}`,
        ) as HTMLElement;
      } else {
        const indicatorId =
          dropItem.value.order < currentElement.value.order ? "up" : "down";
        currentIndicator.value = targetElement.querySelector(
          `#${indicatorId}`,
        ) as HTMLElement;
      }
    } else {
      if (currentElement.value.type !== "card") return;
      const targetListId = listBelow.getAttribute("data-list-id");
      if (!targetListId || targetListId === currentElement.value.taskListId)
        return;
      currentIndicator.value = listBelow.querySelector(
        "#card.drag-area",
      ) as HTMLElement;
    }

    currentIndicator.value.classList.add("dragged-on");
    currentIndicator.value.style.height = `${height.value}px`;
    currentIndicator.value.style.width = `${width.value}px`;
    if (horizontal) {
      currentIndicator.value.style.top = "-3px";
      currentIndicator.value.style.marginInline = "3px";
    }
  }
  function onDragLeave() {
    if (currentIndicator.value) {
      currentIndicator.value?.classList.remove("dragged-on");
      currentIndicator.value.style.height = "2px";
      currentIndicator.value.style.width = "2px";
      currentIndicator.value.style.top = "0";
      currentIndicator.value.style.marginInline = "0";
      currentIndicator.value = null;
    }
    cardToList.value = false;
  }

  function onDragStart(element: HTMLElement) {
    height.value = element.getBoundingClientRect().height;
    width.value = element.getBoundingClientRect().width;
    element.style.width =
      element.getBoundingClientRect().width.toString() + "px";
    element.style.position = "fixed";
    element.style.opacity = "0.8";
    element.style.zIndex = "2";
  }

  function onDrag(e: TouchEvent, element: HTMLElement) {
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;

    element.style.top = (clientY + 5).toString() + "px";
    element.style.left = (clientX + 5).toString() + "px";

    if (parentElement.value) {
      if (clientX >= parentElement.value.getBoundingClientRect().width - 50) {
        parentElement.value.scrollBy({ left: 10, behavior: "smooth" });
      }
    }

    const board = boardsStore.getBoardById(appStore.currentBoardId);
    if (!board) return;

    const elementBelow = document.elementFromPoint(clientX, clientY);
    const targetElement = elementBelow?.closest(`[${dataAttribute}]`);
    const listBelow =
      dataAttribute !== "data-list-id"
        ? elementBelow?.closest(`[data-list-id]`)
        : undefined;

    if (targetElement || listBelow) {
      onDragEnter(targetElement as HTMLElement, listBelow as HTMLElement);
    } else {
      onDragLeave();
    }
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
      dropItem.value.type === "list"
    ) {
      const currentCardIndex = elements.findIndex(
        (item) => item.id === currentElement.value.id,
      );
      if (currentCardIndex === -1) return;

      const [item] = elements.splice(currentCardIndex, 1);

      currentElement.value.taskListId = dropItem.value.id;
      dropItem.value.cards.unshift(item as Card);
      dropItem.value.cards.forEach((item, index) => (item.order = index));
      return;
    }
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

    changeItemOrder(elements, currentElement.value.id, dropItem.value.id);
  }

  return {
    onDragStart,
    onDrag,
    onDragEnd,
  };
}
