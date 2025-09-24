import type { Ref } from "vue";
import type { TaskList } from "../interfaces/Workspace";
import { ref } from "vue";
import { useTaskListsStore } from "../stores/tasklists";
import { useCardsStore } from "../stores/cards";
import { useDragAndDrop } from "./useDragAndDrop";

export function useTaskListDragAndDrop(
  currentTaskList: Ref<TaskList>,
  draggedOver: Ref<boolean>,
  isOnRight: Ref<boolean>,
  elementHeight: Ref<number>,
  cardIsDragged: Ref<boolean>,
) {
  const counter = ref(0);
  const taskListsStore = useTaskListsStore();
  const cardsStore = useCardsStore();
  const { swapItems, dragStart } = useDragAndDrop();

  function startDrag(event: DragEvent) {
    if (!event.dataTransfer) return;
    dragStart(event);
    event.dataTransfer.setData("listId", currentTaskList.value.id);
    event.dataTransfer.setData(
      "listOrder",
      currentTaskList.value.order.toString(),
    );
  }
  function onDragEnter(event: DragEvent) {
    if (!event.dataTransfer) return;
    const itemId = event.dataTransfer.getData("itemId");
    const listId = event.dataTransfer.getData("listId");

    const listOrder = event.dataTransfer.getData("listOrder");
    if ((!itemId && !listId) || listId === currentTaskList.value.id) return;
    counter.value++;
    if (itemId) cardIsDragged.value = true;
    else draggedOver.value = true;
    isOnRight.value = parseInt(listOrder) < currentTaskList.value.order;
    elementHeight.value = parseInt(event.dataTransfer.getData("height"));
  }
  function onDragLeave() {
    counter.value--;
    if (counter.value > 0) return;
    draggedOver.value = false;
    cardIsDragged.value = false;
    elementHeight.value = 0;
    counter.value = 0;
  }
  function onDrop(event: DragEvent) {
    if (!event.dataTransfer) return;
    const itemId = event.dataTransfer.getData("itemId");
    const listId = event.dataTransfer.getData("listId");
    if (!itemId && !listId) return;
    else if (listId) {
      onDragLeave();
      swapItems(taskListsStore.taskLists, listId, currentTaskList.value.id);
      return;
    }
    const item = cardsStore.cards.find((item) => item.id === itemId);
    item && (item.taskListId = currentTaskList.value.id);
    onDragLeave();
  }

  return {
    startDrag,
    onDragEnter,
    onDragLeave,
    onDrop,
  };
}
