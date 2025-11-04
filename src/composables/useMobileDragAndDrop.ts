import type { Card, TaskList, Workspace } from "../interfaces/Workspace.ts";
import { ref, type Ref, watch } from "vue";
import { useDragAndDrop } from "./useDragAndDrop.ts";

const dropItem = ref<Workspace | TaskList | Card | null>(null);

export function useMobileDragAndDrop(
  currentElement: Ref<Workspace | TaskList | Card>,
  elementsData: Array<{
    element: HTMLElement;
    rect: DOMRect;
    data: Workspace | TaskList | Card;
  }>,
) {
  const { transferCardsBetweenLists, changeItemOrder } = useDragAndDrop();

  const draggingCoordinates = ref<{ x: number; y: number } | null>(null);
  const isColliding = ref<boolean>(false);

  function checkCollide(dropElementRect: DOMRect) {
    if (!draggingCoordinates.value) return;
    if (
      draggingCoordinates.value.y >= dropElementRect.top &&
      draggingCoordinates.value.y <= dropElementRect.bottom &&
      draggingCoordinates.value.x >= dropElementRect.left &&
      draggingCoordinates.value.x <= dropElementRect.right
    ) {
      return true;
    }
    return false;
  }
  function onDragStart(e: TouchEvent, element: HTMLElement) {
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    draggingCoordinates.value = { x: clientX, y: clientY };
    element.style.width =
      element.getBoundingClientRect().width.toString() + "px";
    element.style.position = "fixed";
    element.style.transform = "translate(-30%, -30%)";
    element.style.opacity = "0.8";
  }

  function onDrag(e: TouchEvent, element: HTMLElement) {
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    draggingCoordinates.value = { x: clientX, y: clientY };

    element.style.top = clientY.toString() + "px";
    element.style.left = clientX.toString() + "px";

    isColliding.value = elementsData.some((item) => {
      if (checkCollide(item.rect) && currentElement.value.id !== item.data.id) {
        dropItem.value = item.data;
        return true;
      }
      return false;
    });
  }
  function onDragEnd(e: TouchEvent, element: HTMLElement) {
    console.log("Current element: ", currentElement.value);
    console.log("Drop element: ", dropItem.value);
    console.log("Element rect:\n", element.getBoundingClientRect());
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
  }

  return {
    onDragStart,
    onDrag,
    onDragEnd,
  };
}
