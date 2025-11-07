import { type Ref } from "vue";

type Edge = "top" | "bottom" | "left" | "right";

export function useDragScroll(
  parentElement: Ref<HTMLElement | null> | undefined,
  threshold: number,
  maxSpeed: number,
) {
  let currentVelocityY = 0;
  let currentVelocityX = 0;

  let animationId: number | null = null;

  function calculateDelta(distance: number, edge: Edge) {
    const delta = Math.max(0, ((threshold - distance) / threshold) * maxSpeed);
    return edge === "top" || edge === "left" ? -delta : delta;
  }

  function startScrollAnimation(
    targetVelocityX: number,
    targetVelocityY: number,
  ) {
    if (animationId !== null || !parentElement || !parentElement.value) return;

    function animate() {
      currentVelocityX += (targetVelocityX - currentVelocityX) * 0.2;
      currentVelocityY += (targetVelocityY - currentVelocityY) * 0.2;

      parentElement?.value?.scrollBy({
        left: currentVelocityX,
        top: currentVelocityY,
        behavior: "auto",
      });

      animationId = requestAnimationFrame(animate);
    }
    animate();
  }

  function scrollDrag(pointer: { x: number; y: number }) {
    if (!parentElement || !parentElement.value) return;
    const rect = parentElement.value.getBoundingClientRect();

    const distances: Record<Edge, number> = {
      top: pointer.y - rect.top,
      bottom: rect.bottom - pointer.y,
      left: pointer.x - rect.left,
      right: rect.right - pointer.x,
    };

    let targetVelocityX = 0;
    let targetVelocityY = 0;

    if (distances.top <= threshold) {
      targetVelocityY = calculateDelta(distances.top, "top");
    } else if (distances.bottom <= threshold) {
      targetVelocityY = calculateDelta(distances.bottom, "bottom");
    }

    if (distances.left <= threshold) {
      targetVelocityX = calculateDelta(distances.left, "left");
    } else if (distances.right <= threshold) {
      targetVelocityX = calculateDelta(distances.right, "right");
    }

    if (targetVelocityX !== 0 || targetVelocityY !== 0) {
      startScrollAnimation(targetVelocityX, targetVelocityY);
    } else {
      stopScrollAnimation();
    }
  }

  function stopScrollAnimation() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    currentVelocityX = 0;
    currentVelocityY = 0;
  }
  return {
    scrollDrag,
    stopScrollAnimation,
  };
}
