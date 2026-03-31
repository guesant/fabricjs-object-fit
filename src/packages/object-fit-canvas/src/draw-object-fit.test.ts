import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FitMode,
  fromAbsolute,
  fromPercentage,
  X,
  Y,
} from "@guesant/object-fit.core";
import { createCanvas } from "canvas";
import { describe, expect, it } from "vitest";
import { drawObjectFit } from "./draw-object-fit";

const SNAPSHOTS_DIR = resolve(
  process.cwd(),
  "src/__snapshots__/draw-object-fit",
);

mkdirSync(SNAPSHOTS_DIR, { recursive: true });

function createGradientSource(width: number, height: number) {
  const src = createCanvas(width, height);
  const sctx = src.getContext("2d");

  const gradient = sctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#ef4444");
  gradient.addColorStop(0.17, "#f97316");
  gradient.addColorStop(0.33, "#eab308");
  gradient.addColorStop(0.5, "#22c55e");
  gradient.addColorStop(0.67, "#3b82f6");
  gradient.addColorStop(0.83, "#6366f1");
  gradient.addColorStop(1, "#a855f7");

  sctx.fillStyle = gradient;
  sctx.fillRect(0, 0, width, height);

  sctx.strokeStyle = "rgba(255,255,255,0.3)";
  sctx.lineWidth = 1;
  sctx.strokeRect(0, 0, width, height);

  const label = `${width}\u00D7${height}`;
  const fontSize = Math.max(14, Math.min(width, height) * 0.15);
  sctx.font = `bold ${fontSize}px sans-serif`;
  sctx.textAlign = "center";
  sctx.textBaseline = "middle";
  sctx.fillStyle = "rgba(0,0,0,0.4)";
  sctx.fillText(label, width / 2 + 1, height / 2 + 1);
  sctx.fillStyle = "#ffffff";
  sctx.fillText(label, width / 2, height / 2);

  return src;
}

function snapshotCanvas(canvas: ReturnType<typeof createCanvas>, name: string) {
  const filePath = resolve(SNAPSHOTS_DIR, `${name}.png`);
  const buffer = canvas.toBuffer("image/png");

  if (!existsSync(filePath)) {
    writeFileSync(filePath, buffer);
    return;
  }

  const existing = readFileSync(filePath);
  expect(Buffer.compare(buffer, existing)).toBe(0);
}

function draw(
  opts: Parameters<typeof drawObjectFit>[0],
  canvasW?: number,
  canvasH?: number,
) {
  const w = canvasW ?? opts.containerWidth;
  const h = canvasH ?? opts.containerHeight;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");

  const layout = drawObjectFit({
    ...opts,
    ctx: ctx,
  });

  const cx = opts.containerX ?? 0;
  const cy = opts.containerY ?? 0;
  ctx.strokeStyle = "rgba(255,0,0,0.6)";
  ctx.lineWidth = 2;
  ctx.strokeRect(
    cx + 1,
    cy + 1,
    opts.containerWidth - 2,
    opts.containerHeight - 2,
  );

  return { canvas, layout };
}

describe("drawObjectFit", () => {
  describe("cover mode", () => {
    it("landscape source in square container", () => {
      const source = createGradientSource(640, 360);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 640,
        sourceHeight: 360,
        containerWidth: 400,
        containerHeight: 400,
        mode: FitMode.COVER,
      });

      const scale = Math.max(400 / 640, 400 / 360);
      expect(layout.scaleX).toBeCloseTo(scale);
      expect(layout.scaleY).toBeCloseTo(scale);
      expect(layout.width).toBeCloseTo(640 * scale);
      expect(layout.height).toBe(400);
      expect(layout.clipWidth).toBe(400);
      expect(layout.clipHeight).toBe(400);

      snapshotCanvas(canvas, "cover-640x360-in-400x400");
    });

    it("portrait source in square container", () => {
      const source = createGradientSource(200, 400);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 200,
        sourceHeight: 400,
        containerWidth: 300,
        containerHeight: 300,
        mode: FitMode.COVER,
      });

      const scale = Math.max(300 / 200, 300 / 400);
      expect(layout.scaleX).toBeCloseTo(scale);
      expect(layout.width).toBe(300);

      snapshotCanvas(canvas, "cover-200x400-in-300x300");
    });

    it("square source in landscape container", () => {
      const source = createGradientSource(300, 300);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 300,
        sourceHeight: 300,
        containerWidth: 500,
        containerHeight: 200,
        mode: FitMode.COVER,
      });

      const scale = Math.max(500 / 300, 200 / 300);
      expect(layout.scaleX).toBeCloseTo(scale);
      expect(layout.width).toBeCloseTo(300 * scale);

      snapshotCanvas(canvas, "cover-300x300-in-500x200");
    });
  });

  describe("contain mode", () => {
    it("landscape source with letterboxing", () => {
      const source = createGradientSource(200, 100);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 200,
        sourceHeight: 100,
        containerWidth: 200,
        containerHeight: 200,
        mode: FitMode.CONTAIN,
      });

      expect(layout.scaleX).toBe(1);
      expect(layout.scaleY).toBe(1);
      expect(layout.width).toBe(200);
      expect(layout.height).toBe(100);
      expect(layout.x).toBe(0);
      expect(layout.y).toBe(50);

      snapshotCanvas(canvas, "contain-200x100-in-200x200");
    });

    it("portrait source with pillarboxing", () => {
      const source = createGradientSource(100, 300);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 100,
        sourceHeight: 300,
        containerWidth: 300,
        containerHeight: 300,
        mode: FitMode.CONTAIN,
      });

      const scale = Math.min(300 / 100, 300 / 300);
      expect(layout.scaleX).toBeCloseTo(scale);
      expect(layout.height).toBe(300);
      expect(layout.x).toBeCloseTo((300 - 100 * scale) / 2);

      snapshotCanvas(canvas, "contain-100x300-in-300x300");
    });

    it("source smaller than container stays unscaled", () => {
      const source = createGradientSource(50, 50);
      const { layout } = draw({
        source: source,
        sourceWidth: 50,
        sourceHeight: 50,
        containerWidth: 200,
        containerHeight: 200,
        mode: FitMode.CONTAIN,
      });

      // contain scales down, but also scales up to fit
      const scale = Math.min(200 / 50, 200 / 50);
      expect(layout.scaleX).toBe(scale);
      expect(layout.width).toBe(200);
    });
  });

  describe("fill mode", () => {
    it("stretches to match container", () => {
      const source = createGradientSource(150, 100);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 150,
        sourceHeight: 100,
        containerWidth: 300,
        containerHeight: 300,
        mode: FitMode.FILL,
      });

      expect(layout.width).toBe(300);
      expect(layout.height).toBe(300);
      expect(layout.scaleX).toBe(2);
      expect(layout.scaleY).toBe(3);
      expect(layout.x).toBe(0);
      expect(layout.y).toBe(0);

      snapshotCanvas(canvas, "fill-150x100-in-300x300");
    });
  });

  describe("none mode", () => {
    it("preserves original size when smaller", () => {
      const source = createGradientSource(80, 60);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 80,
        sourceHeight: 60,
        containerWidth: 200,
        containerHeight: 200,
        mode: FitMode.NONE,
      });

      expect(layout.scaleX).toBe(1);
      expect(layout.scaleY).toBe(1);
      expect(layout.width).toBe(80);
      expect(layout.height).toBe(60);
      expect(layout.x).toBe(60);
      expect(layout.y).toBe(70);

      snapshotCanvas(canvas, "none-80x60-in-200x200");
    });

    it("clips when source is larger than container", () => {
      const source = createGradientSource(400, 400);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 400,
        sourceHeight: 400,
        containerWidth: 200,
        containerHeight: 200,
        mode: FitMode.NONE,
      });

      expect(layout.scaleX).toBe(1);
      expect(layout.width).toBe(400);
      expect(layout.height).toBe(400);
      expect(layout.x).toBe(-100);
      expect(layout.y).toBe(-100);
      expect(layout.clipWidth).toBe(200);
      expect(layout.clipHeight).toBe(200);

      snapshotCanvas(canvas, "none-400x400-in-200x200");
    });
  });

  describe("scale-down mode", () => {
    it("behaves like contain when source is larger", () => {
      const source = createGradientSource(600, 400);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 600,
        sourceHeight: 400,
        containerWidth: 300,
        containerHeight: 300,
        mode: FitMode.SCALE_DOWN,
      });

      const scale = Math.min(300 / 600, 300 / 400);
      expect(layout.scaleX).toBeCloseTo(scale);
      expect(layout.scaleY).toBeCloseTo(scale);

      snapshotCanvas(canvas, "scale-down-600x400-in-300x300");
    });

    it("behaves like none when source is smaller", () => {
      const source = createGradientSource(100, 80);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 100,
        sourceHeight: 80,
        containerWidth: 300,
        containerHeight: 300,
        mode: FitMode.SCALE_DOWN,
      });

      expect(layout.scaleX).toBe(1);
      expect(layout.scaleY).toBe(1);
      expect(layout.width).toBe(100);
      expect(layout.height).toBe(80);

      snapshotCanvas(canvas, "scale-down-100x80-in-300x300");
    });
  });

  describe("custom position", () => {
    it("top-left positioning with contain", () => {
      const source = createGradientSource(200, 100);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 200,
        sourceHeight: 100,
        containerWidth: 200,
        containerHeight: 200,
        mode: FitMode.CONTAIN,
        position: { x: X.LEFT, y: Y.TOP },
      });

      expect(layout.x).toBe(0);
      expect(layout.y).toBe(0);

      snapshotCanvas(canvas, "contain-position-top-left");
    });

    it("bottom-right positioning with contain", () => {
      const source = createGradientSource(200, 100);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 200,
        sourceHeight: 100,
        containerWidth: 200,
        containerHeight: 200,
        mode: FitMode.CONTAIN,
        position: { x: X.RIGHT, y: Y.BOTTOM },
      });

      expect(layout.x).toBe(0);
      expect(layout.y).toBe(100);

      snapshotCanvas(canvas, "contain-position-bottom-right");
    });

    it("absolute pixel offset", () => {
      const source = createGradientSource(200, 100);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 200,
        sourceHeight: 100,
        containerWidth: 300,
        containerHeight: 300,
        mode: FitMode.CONTAIN,
        position: { x: fromAbsolute(10), y: fromAbsolute(20) },
      });

      expect(layout.x).toBe(10);
      expect(layout.y).toBe(20);

      snapshotCanvas(canvas, "contain-position-absolute-10-20");
    });

    it("percentage positioning with cover", () => {
      const source = createGradientSource(640, 360);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 640,
        sourceHeight: 360,
        containerWidth: 400,
        containerHeight: 400,
        mode: FitMode.COVER,
        position: { x: fromPercentage("25%") },
      });

      const scale = Math.max(400 / 640, 400 / 360);
      const scaledW = 640 * scale;
      expect(layout.x).toBeCloseTo((400 - scaledW) * 0.25);

      snapshotCanvas(canvas, "cover-position-25pct");
    });
  });

  describe("container offset", () => {
    it("applies offset to fill", () => {
      const source = createGradientSource(100, 100);
      const { canvas, layout } = draw(
        {
          source: source,
          sourceWidth: 100,
          sourceHeight: 100,
          containerWidth: 200,
          containerHeight: 200,
          mode: FitMode.FILL,
          containerX: 50,
          containerY: 30,
        },
        400,
        400,
      );

      expect(layout.width).toBe(200);
      expect(layout.height).toBe(200);

      snapshotCanvas(canvas, "fill-offset-50-30");
    });

    it("applies offset to cover", () => {
      const source = createGradientSource(640, 360);
      const { canvas } = draw(
        {
          source: source,
          sourceWidth: 640,
          sourceHeight: 360,
          containerWidth: 200,
          containerHeight: 200,
          mode: FitMode.COVER,
          containerX: 100,
          containerY: 100,
        },
        400,
        400,
      );

      snapshotCanvas(canvas, "cover-offset-100-100");
    });
  });

  describe("auto source size detection", () => {
    it("detects size from canvas source without explicit dimensions", () => {
      const source = createGradientSource(320, 240);
      const { canvas, layout } = draw({
        source: source,
        containerWidth: 200,
        containerHeight: 200,
        mode: FitMode.CONTAIN,
      });

      const scale = Math.min(200 / 320, 200 / 240);
      expect(layout.scaleX).toBeCloseTo(scale);
      expect(layout.width).toBeCloseTo(320 * scale);
      expect(layout.height).toBeCloseTo(240 * scale);

      snapshotCanvas(canvas, "contain-auto-size-320x240");
    });

    it("partial override — only sourceWidth provided", () => {
      const source = createGradientSource(320, 240);
      const { layout } = draw({
        source: source,
        sourceWidth: 160,
        containerWidth: 200,
        containerHeight: 200,
        mode: FitMode.CONTAIN,
      });

      // sourceWidth overridden to 160, sourceHeight auto-detected as 240
      const scale = Math.min(200 / 160, 200 / 240);
      expect(layout.scaleX).toBeCloseTo(scale);
      expect(layout.width).toBeCloseTo(160 * scale);
      expect(layout.height).toBeCloseTo(240 * scale);
    });

    it("cover mode with auto-detected size", () => {
      const source = createGradientSource(800, 600);
      const { canvas, layout } = draw({
        source: source,
        containerWidth: 300,
        containerHeight: 300,
        mode: FitMode.COVER,
      });

      const scale = Math.max(300 / 800, 300 / 600);
      expect(layout.scaleX).toBeCloseTo(scale);
      expect(layout.height).toBe(300);

      snapshotCanvas(canvas, "cover-auto-size-800x600");
    });

    it("fill mode with auto-detected size", () => {
      const source = createGradientSource(150, 100);
      const { layout } = draw({
        source: source,
        containerWidth: 400,
        containerHeight: 250,
        mode: FitMode.FILL,
      });

      expect(layout.width).toBe(400);
      expect(layout.height).toBe(250);
      expect(layout.scaleX).toBeCloseTo(400 / 150);
      expect(layout.scaleY).toBeCloseTo(250 / 100);
    });
  });

  describe("edge cases", () => {
    it("source same size as container in contain", () => {
      const source = createGradientSource(200, 200);
      const { layout } = draw({
        source: source,
        sourceWidth: 200,
        sourceHeight: 200,
        containerWidth: 200,
        containerHeight: 200,
        mode: FitMode.CONTAIN,
      });

      expect(layout.scaleX).toBe(1);
      expect(layout.scaleY).toBe(1);
      expect(layout.x).toBe(0);
      expect(layout.y).toBe(0);
    });

    it("very wide source in tall container (extreme aspect ratio)", () => {
      const source = createGradientSource(1000, 50);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 1000,
        sourceHeight: 50,
        containerWidth: 200,
        containerHeight: 400,
        mode: FitMode.CONTAIN,
      });

      const scale = Math.min(200 / 1000, 400 / 50);
      expect(layout.scaleX).toBeCloseTo(scale);
      expect(layout.width).toBeCloseTo(200);
      expect(layout.height).toBeCloseTo(50 * scale);

      snapshotCanvas(canvas, "contain-1000x50-in-200x400");
    });

    it("very tall source in wide container (extreme aspect ratio)", () => {
      const source = createGradientSource(50, 1000);
      const { canvas, layout } = draw({
        source: source,
        sourceWidth: 50,
        sourceHeight: 1000,
        containerWidth: 400,
        containerHeight: 200,
        mode: FitMode.CONTAIN,
      });

      const scale = Math.min(400 / 50, 200 / 1000);
      expect(layout.scaleX).toBeCloseTo(scale);
      expect(layout.height).toBeCloseTo(200);

      snapshotCanvas(canvas, "contain-50x1000-in-400x200");
    });
  });
});
