import { ref, type Ref } from "vue";
import type { Workspace } from "../interfaces/Workspace";
import { useDragAndDrop } from "./useDragAndDrop";
import { useWorkspacesStore } from "../stores/workspaces";
export function useBoardDragAndDrop(
  currentBoard: Ref<Workspace>,
  draggedOver: Ref<boolean>,
  isAbove: Ref<boolean>,
  elementHeight: Ref<number>,
) {
  const { dragStart, swapItems } = useDragAndDrop();
  const boardsStore = useWorkspacesStore();

  const counter = ref(0);
  function startDrag(event: DragEvent) {
    if (!event.dataTransfer) return;
    dragStart(event);
    event.dataTransfer.setData("boardId", currentBoard.value.id);
    event.dataTransfer.setData(
      "boardOrder",
      currentBoard.value.order.toString(),
    );
  }

  function onDrop(event: DragEvent) {
    if (!event.dataTransfer) return;
    const boardId = event.dataTransfer.getData("boardId");
    if (!boardId) return;

    swapItems(boardsStore.workspaces, boardId, currentBoard.value.id);
    dragLeave();
  }

  function dragEnter(event: DragEvent) {
    if (!event.dataTransfer) return;
    counter.value++;
    const boardId = event.dataTransfer.getData("boardId");
    const boardOrder = event.dataTransfer.getData("boardOrder");
    if (!boardId || boardId === currentBoard.value.id) return;
    draggedOver.value = true;
    isAbove.value = parseInt(boardOrder) > currentBoard.value.order;
    elementHeight.value = parseInt(event.dataTransfer.getData("height"));
  }

  function dragLeave() {
    counter.value--;
    if (counter.value > 0) return;
    counter.value = 0;
    draggedOver.value = false;
    elementHeight.value = 0;
  }
  return { startDrag, onDrop, dragEnter, dragLeave };
}
