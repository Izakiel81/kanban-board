import { type Ref } from "vue";
import type { Card, TaskList, Workspace } from "../interfaces/Workspace";
import { useWorkspacesStore } from "../stores/workspaces";
import { useAppStatesStore } from "../stores/app_store";

const boardsStore = useWorkspacesStore();
const appStore = useAppStatesStore();
export function useDragAndDrop() {
  function dragStart(event: DragEvent, elementHeight: Ref<number>) {
    event.dataTransfer!.dropEffect = "move";
    event.dataTransfer!.effectAllowed = "move";

    const target = event.target as HTMLElement;
    elementHeight.value = target.getBoundingClientRect().height;
  }

  function transferCardsBetweenLists(
    draggedCardId: string,
    dropCardId: string,
    draggedCardTaskLitId: string,
    dropCardTaskListId: string,
  ) {
    const board = boardsStore.getBoardById(appStore.currentBoardId);
    if (!board) {
      console.error("Board is not found");
      return;
    }
    const dragList = boardsStore.getTaskListById(board, draggedCardTaskLitId);
    const dropList = boardsStore.getTaskListById(board, dropCardTaskListId);

    if (!dragList || !dropList) {
      console.error(
        "List is undefined",
        "Drag list: ",
        dragList,
        "Drop list: ",
        dropList,
      );
      return;
    }

    const draggedCardIndex = dragList.cards.findIndex(
      (item) => item.id === draggedCardId,
    );
    const dropCardIndex = dropList.cards.findIndex(
      (item) => item.id === dropCardId,
    );

    if (draggedCardIndex === -1 || dropCardIndex === -1) {
      console.error(
        "Card is not found",
        "Dragged card index: ",
        draggedCardIndex,
        "Drop card index: ",
        dropCardIndex,
      );
      return;
    }

    const [item] = dragList.cards.splice(draggedCardIndex, 1);

    if (draggedCardTaskLitId === dropCardTaskListId) {
      dragList.cards.splice(dropCardIndex, 0, item);
      dragList.cards.forEach((item, index) => (item.order = index));
    } else {
      dropList.cards.splice(dropCardIndex, 0, item);

      dropList.cards.forEach((item, index) => (item.order = index));
      dragList.cards.forEach((item, index) => (item.order = index));
    }
  }

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
