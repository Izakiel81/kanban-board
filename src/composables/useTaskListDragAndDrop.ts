import type { Ref } from "vue";
import type { TaskList } from "../interfaces/Workspace";
import { ref } from "vue";

export function useTaskListDragAndDrop(
  currentTaskList: Ref<TaskList>,
  draggedOver: Ref<boolean>,
  isOnRight: Ref<boolean>,
  elementHeight: Ref<number>,
  cardIsDragged: Ref<boolean>,
) {
  const counter = ref(0);

  function onDragLeave(event: DragEvent) {
    const itemId = event.dataTransfer!.getData("itemId");
    const listId = event.dataTransfer!.getData("listId");

    const listOrder = event.dataTransfer!.getData("listOrder");
    if ((!itemId && !listId) || listId === currentTaskList.value.id) return;
    counter.value++;
    if (itemId) cardIsDragged.value = true;
    else draggedOver.value = true;
    isOnRight.value = parseInt(listOrder) < currentTaskList.value.order;
    elementHeight.value = parseInt(event.dataTransfer!.getData("height"));
  }

  return {
    onDragLeave,
  };
}
