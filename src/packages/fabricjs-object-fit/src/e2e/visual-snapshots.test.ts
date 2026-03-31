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

// ─── useObjectTransform: true (with custom transform) ─────────────────────

describe("useObjectTransform: true with position", () => {
  for (const { file, label } of SIZE_CASES) {
    for (const { mode, name } of FIT_MODES) {
      it(`${label} ${name} — positioned at (30, 20)`, async () => {
        const img = await loadFabricImage(file);
        img.set({ left: 30, top: 20 });
        img.setCoords();

        const container = new ObjectFit(img, {
          mode,
          width: CONTAINER_WIDTH,
          height: CONTAINER_HEIGHT,
          useObjectTransform: true,
        });

        const buffer = renderToBuffer(container, CANVAS_WIDTH, CANVAS_HEIGHT);
        expectToMatchSnapshot(buffer, `uot-true-pos-${label}-${name}.png`);
      });
    }
  }
});

describe("useObjectTransform: true with center origin", () => {
  for (const { mode, name } of FIT_MODES) {
    it(`${name} — center origin at (250, 230)`, async () => {
      const img = await loadFabricImage("600x400.png");
      img.set({
        left: 250,
        top: 230,
        originX: "center",
        originY: "center",
      });
      img.setCoords();

      const container = new ObjectFit(img, {
        mode,
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        useObjectTransform: true,
      });

      const buffer = renderToBuffer(container, CANVAS_WIDTH, CANVAS_HEIGHT);
      expectToMatchSnapshot(buffer, `uot-true-center-origin-${name}.png`);
    });
  }
});

describe("useObjectTransform: true with scale and angle", () => {
  it("scaled 1.5x cover", async () => {
    const img = await loadFabricImage("200x100.png");
    img.set({ left: 10, top: 10, scaleX: 1.5, scaleY: 1.5 });
    img.setCoords();

    const container = new ObjectFit(img, {
      mode: FitMode.COVER,
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      useObjectTransform: true,
    });

    const buffer = renderToBuffer(container, CANVAS_WIDTH, CANVAS_HEIGHT);
    expectToMatchSnapshot(buffer, `uot-true-scaled-cover.png`);
  });

  it("rotated 45deg contain", async () => {
    const img = await loadFabricImage("200x100.png");
    img.set({ left: 10, top: 10, angle: 45 });
    img.setCoords();

    const container = new ObjectFit(img, {
      mode: FitMode.CONTAIN,
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      useObjectTransform: true,
    });

    const buffer = renderToBuffer(container, CANVAS_WIDTH, CANVAS_HEIGHT);
    expectToMatchSnapshot(buffer, `uot-true-rotated-contain.png`);
  });

  it("center origin + scaled + rotated fill", async () => {
    const img = await loadFabricImage("200x100.png");
    img.set({
      left: 200,
      top: 150,
      originX: "center",
      originY: "center",
      scaleX: 1.5,
      scaleY: 1.5,
      angle: 30,
    });
    img.setCoords();

    const container = new ObjectFit(img, {
      mode: FitMode.FILL,
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      useObjectTransform: true,
    });

    const buffer = renderToBuffer(container, CANVAS_WIDTH, CANVAS_HEIGHT);
    expectToMatchSnapshot(buffer, `uot-true-center-scaled-rotated-fill.png`);
  });
});

// ─── useObjectTransform: false ────────────────────────────────────────────

describe("useObjectTransform: false ignores object transform", () => {
  for (const { mode, name } of FIT_MODES) {
    it(`${name} — object at (80, 60) should render at origin`, async () => {
      const img = await loadFabricImage("600x400.png");
      img.set({ left: 80, top: 60 });
      img.setCoords();

      const container = new ObjectFit(img, {
        mode,
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        useObjectTransform: false,
      });

      const buffer = renderToBuffer(container, CANVAS_WIDTH, CANVAS_HEIGHT);
      expectToMatchSnapshot(buffer, `uot-false-${name}.png`);
    });
  }

  it("ignores center origin + scale + angle", async () => {
    const img = await loadFabricImage("200x100.png");
    img.set({
      left: 200,
      top: 150,
      originX: "center",
      originY: "center",
      scaleX: 2,
      scaleY: 2,
      angle: 45,
    });
    img.setCoords();

    const container = new ObjectFit(img, {
      mode: FitMode.COVER,
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      useObjectTransform: false,
    });

    const buffer = renderToBuffer(container, CANVAS_WIDTH, CANVAS_HEIGHT);
    expectToMatchSnapshot(buffer, `uot-false-complex-transform.png`);
  });
});

// ─── useObjectTransform: true vs false visual consistency ─────────────────

describe("useObjectTransform: true with identity transform matches false", () => {
  for (const { mode, name } of FIT_MODES) {
    it(`${name} — identity transform produces same result`, async () => {
      const imgTrue = await loadFabricImage("600x400.png");
      const imgFalse = await loadFabricImage("600x400.png");

      const containerTrue = new ObjectFit(imgTrue, {
        mode,
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        useObjectTransform: true,
      });

      const containerFalse = new ObjectFit(imgFalse, {
        mode,
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        useObjectTransform: false,
      });

      const bufferTrue = renderToBuffer(
        containerTrue,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
      );
      const bufferFalse = renderToBuffer(
        containerFalse,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
      );

      expect(bufferTrue.equals(bufferFalse)).toBe(true);
    });
  }
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
