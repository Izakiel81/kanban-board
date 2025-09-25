import { type Ref } from "vue";
import type { Workspace } from "../interfaces/Workspace";
import { useDragAndDrop } from "./useDragAndDrop";
import { useWorkspacesStore } from "../stores/workspaces";
export function useBoardDragAndDrop(currentBoard: Ref<Workspace>) {
  const { dragStart, swapItems } = useDragAndDrop();
  const boardsStore = useWorkspacesStore();

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
  }
  return { startDrag, onDrop };
}
