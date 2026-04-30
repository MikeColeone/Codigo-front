export function resolveSlotZoneFromPoint(args: {
  clientX: number;
  clientY: number;
  excludeContainerId?: string;
}): HTMLElement | null {
  const { clientX, clientY, excludeContainerId } = args;

  const stack = ((): HTMLElement[] => {
    if (typeof document.elementsFromPoint === "function") {
      return document.elementsFromPoint(clientX, clientY) as HTMLElement[];
    }
    const element = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    return element ? [element] : [];
  })();

  for (const element of stack) {
    const slotZone = element.closest("[data-slot-name]") as HTMLElement | null;
    if (slotZone?.dataset.containerId) {
      return slotZone;
    }
  }

  for (const element of stack) {
    const wrapper = element.closest(".component-warpper") as HTMLElement | null;
    const containerId = wrapper?.dataset.id;
    if (!containerId || containerId === excludeContainerId) {
      continue;
    }

    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        `[data-container-id="${containerId}"][data-slot-name]`,
      ),
    );

    if (!candidates.length) {
      continue;
    }

    let best = candidates[0] ?? null;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const candidate of candidates) {
      const rect = candidate.getBoundingClientRect();
      const dx =
        clientX < rect.left
          ? rect.left - clientX
          : clientX > rect.right
            ? clientX - rect.right
            : 0;
      const dy =
        clientY < rect.top
          ? rect.top - clientY
          : clientY > rect.bottom
            ? clientY - rect.bottom
            : 0;
      const score = dx * dx + dy * dy;
      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    return best;
  }

  return null;
}
