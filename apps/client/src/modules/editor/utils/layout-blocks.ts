import { ulid } from "ulid";
import type { LayoutBlock } from "@codigo/schema";

export type LayoutSplitOrientation = "vertical" | "horizontal";

export function createRootLayoutBlock(width: number, height: number, id = "root"): LayoutBlock {
  return {
    id,
    x: 0,
    y: 0,
    width: Math.max(0, Math.round(width)),
    height: Math.max(0, Math.round(height)),
  };
}

export function cloneLayoutBlocks(blocks: LayoutBlock[]) {
  return blocks.map((block) => ({ ...block }));
}

export function findLayoutBlockAt(blocks: LayoutBlock[], x: number, y: number) {
  const px = Math.round(x);
  const py = Math.round(y);
  for (let i = 0; i < blocks.length; i += 1) {
    const b = blocks[i];
    if (
      px >= b.x &&
      py >= b.y &&
      px <= b.x + b.width &&
      py <= b.y + b.height
    ) {
      return b;
    }
  }
  return null;
}

export function splitLayoutBlocks(
  blocks: LayoutBlock[],
  args: {
    blockId: string;
    orientation: LayoutSplitOrientation;
    position: number;
    minBlockSize?: number;
    idFactory?: () => string;
  },
) {
  const minBlockSize = Math.max(1, Math.round(args.minBlockSize ?? 24));
  const createId = args.idFactory ?? ulid;

  const targetIndex = blocks.findIndex((item) => item.id === args.blockId);
  if (targetIndex < 0) return null;

  const target = blocks[targetIndex]!;
  if (args.orientation === "vertical") {
    const splitX = Math.round(args.position);
    const minX = target.x + minBlockSize;
    const maxX = target.x + target.width - minBlockSize;
    if (splitX <= minX || splitX >= maxX) return null;

    const left: LayoutBlock = {
      id: createId(),
      x: target.x,
      y: target.y,
      width: splitX - target.x,
      height: target.height,
    };
    const right: LayoutBlock = {
      id: createId(),
      x: splitX,
      y: target.y,
      width: target.x + target.width - splitX,
      height: target.height,
    };

    const next = blocks.slice();
    next.splice(targetIndex, 1, left, right);
    return next;
  }

  const splitY = Math.round(args.position);
  const minY = target.y + minBlockSize;
  const maxY = target.y + target.height - minBlockSize;
  if (splitY <= minY || splitY >= maxY) return null;

  const top: LayoutBlock = {
    id: createId(),
    x: target.x,
    y: target.y,
    width: target.width,
    height: splitY - target.y,
  };
  const bottom: LayoutBlock = {
    id: createId(),
    x: target.x,
    y: splitY,
    width: target.width,
    height: target.y + target.height - splitY,
  };

  const next = blocks.slice();
  next.splice(targetIndex, 1, top, bottom);
  return next;
}


