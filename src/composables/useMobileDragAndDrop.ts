import type { Card, TaskList, Workspace } from "../interfaces/Workspace.ts";
import { ref, type Ref } from "vue";
import { useDragAndDrop } from "./useDragAndDrop.ts";
export function useMobileDragAndDrop(
  currentElement: Ref<Workspace | TaskList | Card>,
  elementsData: Array<{
    element: HTMLElement;
    rect: DOMRect;
    data: Workspace | TaskList | Card;
  }>,
) {
  const {} = useDragAndDrop();

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
    console.log("STARTED DRAGGING \n", "Event: ", e, "\nElement: ", element);
    console.log("Element coords: ", element.getBoundingClientRect());
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    draggingCoordinates.value = { x: clientX, y: clientY };
    console.log("\nFinger cords:\n", "X: ", clientX, "\nY: ", clientY);
  }

  function onDrag(e: TouchEvent, element: HTMLElement) {
    console.log("DRAGGING\n", "Event: ", e, "\nElement: ", element);
    console.log("Element coords: ", element.getBoundingClientRect());

    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    draggingCoordinates.value = { x: clientX, y: clientY };

    isColliding.value = elementsData.some((item) => {
      if (checkCollide(item.rect)) {
        return true;
      }
      return false;
    });
    console.log("Colliding: ", isColliding.value);
    console.log("Elements rects", elementsData);
    console.log("\nFinger cords:\n", "X: ", clientX, "\nY: ", clientY);
  }
  function onDragEnd(e: TouchEvent, element: HTMLElement) {
    console.log("ENDED DRAGGING\n", "Event: ", e, "\nElement: ", element);
    console.log("Element coords: ", element.getBoundingClientRect());
    console.log("\nEnd coordinates:\n", draggingCoordinates.value);
  }

  return {
    onDragStart,
    onDrag,
    onDragEnd,
  };
}
