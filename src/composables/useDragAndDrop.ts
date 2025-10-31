import { type Ref } from "vue";
import type { Card, TaskList, Workspace } from "../interfaces/Workspace";
export function useDragAndDrop() {
  function dragStart(event: DragEvent, elementHeight: Ref<number>) {
    event.dataTransfer!.dropEffect = "move";
    event.dataTransfer!.effectAllowed = "move";

    const target = event.target as HTMLElement;
    elementHeight.value = target.getBoundingClientRect().height;
  }

  function transferCardsBetweenLists(
    listFrom: Array<TaskList>,
    listTo: Array<TaskList>,
    draggedCardId: string,
    doppedCardId: string,
  ) {}

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
  };
}
