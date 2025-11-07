import { ref, type Ref } from "vue";

type Edge = "top" | "bottom" | "left" | "right";

export function useDragScroll(
  parentElement: Ref<HTMLElement | null>,
  threshold: number,
  maxSpeed: number,
) {
  const currentVelocityY = ref<number>(0);
  const currentVelocityX = ref<number>(0);

  const animationId = ref<number | null>(null);

  function calculateDelta(distance: number, edge: Edge) {
    const delta = Math.max(0, ((threshold - distance) / threshold) * maxSpeed);
    return edge === "top" || edge === "left" ? -delta : delta;
  }

  function startScrollAnimation(
    targetVelocityX: number,
    targetVelocityY: number,
  ) {
    if (animationId.value !== null || !parentElement.value) return;

    function animate() {
      currentVelocityX.value +=
        (targetVelocityX - currentVelocityX.value) * 0.2;

      currentVelocityY.value +=
        (targetVelocityY - currentVelocityY.value) * 0.2;

      parentElement.value?.scrollBy({
        left: currentVelocityX.value,
        top: currentVelocityY.value,
        behavior: "auto",
      });

      animationId.value = requestAnimationFrame(animate);
    }
    animate();
  }

  function scrollDrag(pointer: { x: number; y: number }) {
    if (!parentElement.value) return;
    const rect = parentElement.value.getBoundingClientRect();

    const distances: Record<Edge, number> = {
      top: pointer.y - rect.top,
      bottom: rect.bottom - pointer.y,
      left: pointer.x - rect.left,
      right: rect.right - pointer.x,
    };

    let targetVelocityX = 0;
    let targetVelocityY = 0;

    for (const edge of ["top", "bottom", "left", "right"] as Edge[]) {
      if (distances[edge] <= threshold) {
        if (edge === "top" || edge === "bottom")
          targetVelocityY = calculateDelta(distances[edge], edge);
        if (edge === "left" || edge === "right")
          targetVelocityX = calculateDelta(distances[edge], edge);
      }
    }

    if (targetVelocityX !== 0 || targetVelocityY !== 0) {
      startScrollAnimation(targetVelocityX, targetVelocityY);
    } else {
      stopScrollAnimation();
    }
  }

  function stopScrollAnimation() {
    if (animationId.value !== null) {
      cancelAnimationFrame(animationId.value);
      animationId.value = null;
    }
    currentVelocityX.value = 0;
    currentVelocityY.value = 0;
  }
  return {
    startScrollAnimation,
    scrollDrag,
    stopScrollAnimation,
  };
}
