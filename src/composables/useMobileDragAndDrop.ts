export function useMobileDragAndDrop() {
  function onDragStart(e: MouseEvent | TouchEvent, element: HTMLelement) {
    console.log("DRAGGIN SHIT", "Event: ", e, "Element: ", element);
  }

  return {
    onDragStart,
  };
}
