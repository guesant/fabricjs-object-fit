import { describe, expect, it } from "vitest";
import { FitMode } from "../enums/fit-mode";
import {
  computeContainScale,
  computeCoverScale,
  computeFillScale,
  computeNoneScale,
  computeScale,
  computeScaleDownScale,
} from "./compute-scale";

describe("computeFillScale", () => {
  it("stretches independently on each axis", () => {
    const result = computeFillScale(
      { width: 400, height: 200 },
      { width: 200, height: 100 },
    );
    expect(result).toEqual({ scaleX: 2, scaleY: 2 });
  });

  it("handles non-uniform scaling", () => {
    const result = computeFillScale(
      { width: 400, height: 100 },
      { width: 200, height: 200 },
    );
    expect(result).toEqual({ scaleX: 2, scaleY: 0.5 });
  });
});

describe("computeCoverScale", () => {
  it("uses max scale factor for uniform scaling", () => {
    const result = computeCoverScale(
      { width: 400, height: 400 },
      { width: 640, height: 360 },
    );
    const expected = Math.max(400 / 640, 400 / 360);
    expect(result).toEqual({ scaleX: expected, scaleY: expected });
  });

  it("covers container fully", () => {
    const result = computeCoverScale(
      { width: 200, height: 200 },
      { width: 400, height: 100 },
    );
    // max(200/400=0.5, 200/100=2) = 2
    expect(result).toEqual({ scaleX: 2, scaleY: 2 });
  });
});

describe("computeContainScale", () => {
  it("uses min scale factor for uniform scaling", () => {
    const result = computeContainScale(
      { width: 400, height: 400 },
      { width: 640, height: 360 },
    );
    const expected = Math.min(400 / 640, 400 / 360);
    expect(result).toEqual({ scaleX: expected, scaleY: expected });
  });

  it("fits entirely within container", () => {
    const result = computeContainScale(
      { width: 200, height: 200 },
      { width: 400, height: 100 },
    );
    // min(200/400=0.5, 200/100=2) = 0.5
    expect(result).toEqual({ scaleX: 0.5, scaleY: 0.5 });
  });
});

describe("computeNoneScale", () => {
  it("always returns scale 1", () => {
    const result = computeNoneScale(
      { width: 400, height: 400 },
      { width: 640, height: 360 },
    );
    expect(result).toEqual({ scaleX: 1, scaleY: 1 });
  });
});

describe("computeScaleDownScale", () => {
  it("uses contain when object is larger", () => {
    const container = { width: 200, height: 200 };
    const object = { width: 400, height: 300 };
    const result = computeScaleDownScale(container, object);
    const expected = computeContainScale(container, object);
    expect(result).toEqual(expected);
  });

  it("uses none when object is smaller", () => {
    const result = computeScaleDownScale(
      { width: 400, height: 400 },
      { width: 200, height: 200 },
    );
    expect(result).toEqual({ scaleX: 1, scaleY: 1 });
  });

  it("uses contain when only width exceeds", () => {
    const result = computeScaleDownScale(
      { width: 200, height: 400 },
      { width: 300, height: 100 },
    );
    expect(result.scaleX).toBeLessThan(1);
  });
});

describe("computeScale", () => {
  const container = { width: 400, height: 400 };
  const object = { width: 640, height: 360 };

  it("dispatches to fill", () => {
    expect(computeScale(FitMode.FILL, container, object)).toEqual(
      computeFillScale(container, object),
    );
  });

  it("dispatches to cover", () => {
    expect(computeScale(FitMode.COVER, container, object)).toEqual(
      computeCoverScale(container, object),
    );
  });

  it("dispatches to contain", () => {
    expect(computeScale(FitMode.CONTAIN, container, object)).toEqual(
      computeContainScale(container, object),
    );
  });

  it("dispatches to none", () => {
    expect(computeScale(FitMode.NONE, container, object)).toEqual(
      computeNoneScale(container, object),
    );
  });

  it("dispatches to scale-down", () => {
    expect(computeScale(FitMode.SCALE_DOWN, container, object)).toEqual(
      computeScaleDownScale(container, object),
    );
  });
});
