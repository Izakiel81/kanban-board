import { type Ref } from "vue";
import type { Workspace } from "../interfaces/Workspace";
import { useDragAndDrop } from "./useDragAndDrop";
export function useBoardDragAndDrop(currentBoard: Ref<Workspace>) {
  const { dragStart } = useDragAndDrop();
  function startDrag(event: DragEvent) {
    if (!event.dataTransfer) return;
    dragStart(event);
    event.dataTransfer.setData("boardId", currentBoard.value.id);
    event.dataTransfer.setData(
      "boardOrder",
      currentBoard.value.order.toString(),
    );
  }
  return { startDrag };
}
