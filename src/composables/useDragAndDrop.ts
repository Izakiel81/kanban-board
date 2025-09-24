export function useDragAndDrop() {
  function dragStart(event: DragEvent) {
    event.dataTransfer!.dropEffect = "move";
    event.dataTransfer!.effectAllowed = "move";

    const target = event.target as HTMLElement;
    event.dataTransfer!.setData(
      "width",
      target.getBoundingClientRect().width.toString(),
    );
    event.dataTransfer!.setData(
      "height",
      target.getBoundingClientRect().height.toString(),
    );
  }
  function swapItems(
    list: any[],
    draggedItemId: number,
    droppedItemId: number,
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
