import { describe, expect, it } from "vitest";
import { computeLayout } from "./compute-layout";
import { FitMode } from "./enums/fit-mode";
import { X, Y } from "./point/axis-aliases";
import { fromAbsolute } from "./point/from-absolute";

describe("computeLayout", () => {
  const container = { width: 400, height: 400 };
  const object = { width: 640, height: 360 };

  it("cover: fills container, centered by default", () => {
    const layout = computeLayout({
      mode: FitMode.COVER,
      container,
      object,
    });

    const scale = Math.max(400 / 640, 400 / 360);
    const scaledW = 640 * scale;
    const scaledH = 360 * scale;

    expect(layout.scaleX).toBeCloseTo(scale);
    expect(layout.scaleY).toBeCloseTo(scale);
    expect(layout.width).toBeCloseTo(scaledW);
    expect(layout.height).toBeCloseTo(scaledH);
    // centered: (container - scaled) * 0.5
    expect(layout.x).toBeCloseTo((400 - scaledW) * 0.5);
    expect(layout.y).toBe(0); // scaledH === 400, so y === 0
    expect(layout.clipX).toBe(0);
    expect(layout.clipY).toBe(0);
    expect(layout.clipWidth).toBe(400);
    expect(layout.clipHeight).toBe(400);
  });

  it("contain: fits inside, centered by default", () => {
    const layout = computeLayout({
      mode: FitMode.CONTAIN,
      container,
      object,
    });

    const scale = Math.min(400 / 640, 400 / 360);
    const scaledW = 640 * scale;
    const scaledH = 360 * scale;

    expect(layout.scaleX).toBeCloseTo(scale);
    expect(layout.width).toBeCloseTo(scaledW);
    expect(layout.height).toBeCloseTo(scaledH);
    expect(layout.x).toBe(0); // scaledW === 400
    expect(layout.y).toBeCloseTo((400 - scaledH) * 0.5);
  });

  it("fill: stretches to match container", () => {
    const layout = computeLayout({
      mode: FitMode.FILL,
      container,
      object,
    });

    expect(layout.width).toBe(400);
    expect(layout.height).toBe(400);
    expect(layout.x).toBe(0);
    expect(layout.y).toBe(0);
  });

  it("none: uses original size", () => {
    const layout = computeLayout({
      mode: FitMode.NONE,
      container,
      object,
    });

    expect(layout.scaleX).toBe(1);
    expect(layout.scaleY).toBe(1);
    expect(layout.width).toBe(640);
    expect(layout.height).toBe(360);
  });

  it("respects custom position", () => {
    const layout = computeLayout({
      mode: FitMode.CONTAIN,
      container,
      object,
      position: {
        x: X.LEFT,
        y: Y.BOTTOM,
      },
    });

    const scale = Math.min(400 / 640, 400 / 360);
    const scaledH = 360 * scale;

    expect(layout.x).toBe(0); // LEFT
    expect(layout.y).toBeCloseTo(400 - scaledH); // BOTTOM
  });

  it("respects absolute position", () => {
    const layout = computeLayout({
      mode: FitMode.CONTAIN,
      container,
      object,
      position: {
        x: fromAbsolute(10),
        y: fromAbsolute(20),
      },
    });

    expect(layout.x).toBe(10);
    expect(layout.y).toBe(20);
  });

  it("clip region always matches container", () => {
    const layout = computeLayout({
      mode: FitMode.NONE,
      container: { width: 300, height: 200 },
      object: { width: 500, height: 500 },
    });

    expect(layout.clipX).toBe(0);
    expect(layout.clipY).toBe(0);
    expect(layout.clipWidth).toBe(300);
    expect(layout.clipHeight).toBe(200);
  });
});
