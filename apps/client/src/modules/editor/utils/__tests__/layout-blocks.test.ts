import { describe, expect, it } from "vitest";
import { createLayoutHistoryStore } from "@/modules/editor/stores/layout-history";
import {
  createRootLayoutBlock,
  splitLayoutBlocks,
} from "@/modules/editor/utils/layout-blocks";

function createIdFactory() {
  let i = 0;
  return () => `id_${i++}`;
}

function expectClose(actual: number, expected: number, tolerance = 1) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

describe("layout blocks", () => {
  it("splits with ±1px precision", () => {
    const root = createRootLayoutBlock(1920, 1080);
    const next = splitLayoutBlocks([root], {
      blockId: "root",
      orientation: "vertical",
      position: 640,
      idFactory: createIdFactory(),
    });
    expect(next).not.toBeNull();
    expect(next!.length).toBe(2);
    const [a, b] = next!;
    expectClose(a.x, 0);
    expectClose(a.y, 0);
    expectClose(a.width, 640);
    expectClose(a.height, 1080);
    expectClose(b.x, 640);
    expectClose(b.y, 0);
    expectClose(b.width, 1280);
    expectClose(b.height, 1080);
  });

  it("undo stack supports >= 20 steps", () => {
    const history = createLayoutHistoryStore();
    const pageId = "p1";
    for (let i = 0; i < 25; i += 1) {
      history.push(pageId, [{ id: `b${i}`, x: i, y: 0, width: 10, height: 10 }]);
    }
    expect(history.depth(pageId)).toBe(25);
    for (let i = 0; i < 20; i += 1) {
      const snap = history.undo(pageId);
      expect(snap).not.toBeNull();
    }
  });

});

