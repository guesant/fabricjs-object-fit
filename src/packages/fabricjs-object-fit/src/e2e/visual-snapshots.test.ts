import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { IPosition } from "@guesant/object-fit.core";
import {
  FitMode,
  fromAbsolute,
  fromFactor,
  fromPercentage,
  fromTag,
  Tag,
  X,
  Y,
} from "@guesant/object-fit.core";
import { loadImage } from "canvas";
import * as fabric from "fabric/node";
import { createObjectFitClass } from "../create-object-fit-class";

const E2E_DIR = resolve(process.cwd(), "src/e2e");
const SNAPSHOTS_DIR = resolve(E2E_DIR, "__snapshots__/images");
const FIXTURES_DIR = resolve(E2E_DIR, "fixtures");

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 460;
const CONTAINER_WIDTH = 440;
const CONTAINER_HEIGHT = 340;

const ObjectFit = createObjectFitClass(fabric);

async function loadFabricImage(
  filename: string,
): Promise<InstanceType<typeof fabric.FabricImage>> {
  const nodeImage = await loadImage(resolve(FIXTURES_DIR, filename));
  return new fabric.FabricImage(nodeImage as unknown as HTMLImageElement, {
    originX: "left",
    originY: "top",
    top: 0,
    left: 0,
  });
}

function renderToBuffer(
  container: InstanceType<ReturnType<typeof createObjectFitClass>>,
  canvasWidth: number,
  canvasHeight: number,
): Buffer {
  const canvas = new fabric.StaticCanvas(undefined, {
    width: canvasWidth,
    height: canvasHeight,
  });
  canvas.add(container);
  canvas.renderAll();

  // Draw container border
  const nodeCanvas = canvas.getNodeCanvas();
  const ctx = nodeCanvas.getContext("2d");
  const bounds = container.getBoundingRect();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);

  return nodeCanvas.toBuffer("image/png");
}

function expectToMatchSnapshot(buffer: Buffer, snapshotName: string): void {
  const filePath = resolve(SNAPSHOTS_DIR, snapshotName);

  if (!existsSync(filePath) || process.env.UPDATE_SNAPSHOTS) {
    writeFileSync(filePath, buffer);
    return;
  }

  const stored = readFileSync(filePath);
  expect(buffer.equals(stored)).toBe(true);
}

// ─── Helpers for generating test matrices ───────────────────────────────────

const FIT_MODES = [
  { mode: FitMode.COVER, name: "cover" },
  { mode: FitMode.CONTAIN, name: "contain" },
  { mode: FitMode.FILL, name: "fill" },
  { mode: FitMode.NONE, name: "none" },
  { mode: FitMode.SCALE_DOWN, name: "scale-down" },
] as const;

// Container is 440x340. These 4 fixtures cover all width/height relationships.
const SIZE_CASES = [
  { file: "600x400.png", label: "w>W-h>H" }, // both larger
  { file: "200x100.png", label: "w<W-h<H" }, // both smaller
  { file: "600x100.png", label: "w>W-h<H" }, // wider but shorter
  { file: "200x400.png", label: "w<W-h>H" }, // narrower but taller
] as const;

function describeFitSizeMatrix(
  suiteName: string,
  snapshotPrefix: string,
  options?: {
    position?: Partial<IPosition>;
  },
) {
  describe(suiteName, () => {
    for (const { file, label } of SIZE_CASES) {
      describe(label, () => {
        for (const { mode, name } of FIT_MODES) {
          it(`${name}`, async () => {
            const img = await loadFabricImage(file);

            const container = new ObjectFit(img, {
              mode,
              width: CONTAINER_WIDTH,
              height: CONTAINER_HEIGHT,
              ...options,
            });

            const buffer = renderToBuffer(
              container,
              CANVAS_WIDTH,
              CANVAS_HEIGHT,
            );
            expectToMatchSnapshot(
              buffer,
              `${snapshotPrefix}-${label}-${name}.png`,
            );
          });
        }
      });
    }
  });
}

// ─── Fit Modes × Size Cases (default center position) ──────────────────────

describeFitSizeMatrix("Fit Modes (centered)", "fit");

// ─── Fit Modes × Size Cases (top-left position) ────────────────────────────

describeFitSizeMatrix("Fit Modes (top-left)", "fit-tl", {
  position: { x: X.LEFT, y: Y.TOP },
});

// ─── Fit Modes × Size Cases (bottom-right position) ────────────────────────

describeFitSizeMatrix("Fit Modes (bottom-right)", "fit-br", {
  position: { x: X.RIGHT, y: Y.BOTTOM },
});

// ─── Position Modes ─────────────────────────────────────────────────────────

describe("Position Modes", () => {
  const positions = [
    {
      name: "absolute",
      position: { x: fromAbsolute(10), y: fromAbsolute(10) },
    },
    {
      name: "percentage-50-75",
      position: { x: fromPercentage("50%"), y: fromPercentage("75%") },
    },
    {
      name: "aliased-right-top",
      position: { x: X.RIGHT, y: Y.TOP },
    },
    {
      name: "tagged-start-end",
      position: { x: fromTag(Tag.START), y: fromTag(Tag.END) },
    },
    {
      name: "factor-025",
      position: { x: fromFactor(0.25), y: fromFactor(0.25) },
    },
  ] as const;

  for (const { name, position } of positions) {
    it(`should render ${name} position correctly`, async () => {
      const img = await loadFabricImage("600x400.png");

      const container = new ObjectFit(img, {
        mode: FitMode.NONE,
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        position,
      });

      const buffer = renderToBuffer(container, CANVAS_WIDTH, CANVAS_HEIGHT);
      expectToMatchSnapshot(buffer, `position-${name}.png`);
    });
  }
});
