import { type Ref } from "vue";
import type { Card, TaskList, Workspace } from "../interfaces/Workspace";
export function useDragAndDrop() {
  function dragStart(event: DragEvent, elementHeight: Ref<number>) {
    event.dataTransfer!.dropEffect = "move";
    event.dataTransfer!.effectAllowed = "move";

    const target = event.target as HTMLElement;
    elementHeight.value = target.getBoundingClientRect().height;
  }
  function swapItems(
    list: Array<Workspace | TaskList | Card>,
    draggedItemId: string,
    droppedItemId: string,
  ) {
    const draggedItemIndex = list.findIndex(
      (item) => item.id === draggedItemId,
    );
    const droppedItemIndex = list.findIndex(
      (item) => item.id === droppedItemId,
    );

    if (
      draggedItemIndex === -1 ||
      droppedItemIndex === -1 ||
      draggedItemIndex === droppedItemIndex
    )
      return;
    if (
      (list[draggedItemIndex] as Card).taskListId &&
      (list[droppedItemIndex] as Card).taskListId
    )
      (list[draggedItemIndex] as Card).taskListId = (
        list[droppedItemIndex] as Card
      ).taskListId;

    list[draggedItemIndex].order =
      list[draggedItemIndex].order + list[droppedItemIndex].order;
    list[droppedItemIndex].order =
      list[draggedItemIndex].order - list[droppedItemIndex].order;
    list[draggedItemIndex].order =
      list[draggedItemIndex].order - list[droppedItemIndex].order;
  }

  return {
    dragStart,
    swapItems,
  };
}
