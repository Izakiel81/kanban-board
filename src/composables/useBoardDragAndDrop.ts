import { ref, type Ref } from "vue";
import type { Workspace } from "../interfaces/Workspace";
import { useDragAndDrop } from "./useDragAndDrop";
import { useWorkspacesStore } from "../stores/workspaces";

const draggedBoard = ref<Workspace | null>(null);
const height = ref<number>(0);

export function useBoardDragAndDrop(
  currentBoard: Ref<Workspace>,
  draggedOver: Ref<boolean>,
  isAbove: Ref<boolean>,
  elementHeight: Ref<number>,
) {
  const { dragStart, swapItems } = useDragAndDrop();
  const boardsStore = useWorkspacesStore();

  const counter = ref<number>(0);
  function startDrag(event: DragEvent) {
    if (!event.dataTransfer) return;
    dragStart(event, height);
    draggedBoard.value = currentBoard.value;
  }

  function onDrop() {
    if (!draggedBoard.value) return;
    swapItems(
      boardsStore.workspaces,
      draggedBoard.value.id,
      currentBoard.value.id,
    );
    dragLeave();
  }

  function dragEnter() {
    if (!draggedBoard.value) return;
    counter.value++;
    if (draggedBoard.value.id === currentBoard.value.id) return;
    draggedOver.value = true;
    isAbove.value = draggedBoard.value.order > currentBoard.value.order;
    elementHeight.value = height.value;
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
