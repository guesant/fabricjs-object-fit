import * as fabric from "fabric";
import { divideBy } from "../misc/divideBy";
import { getFakeObject } from "../misc/Fabric/getFakeObject";
import { fromAbsolute } from "../Point/index.js";
import { getScaleDownFittedObject } from "./getScaleDownFittedObject";

describe(getScaleDownFittedObject.name, () => {
  const makeOptions = (
    width: number,
    height: number,
    absPosX: number,
    absPosY: number,
  ) => ({
    width,
    height,
    position: {
      x: fromAbsolute(absPosX),
      y: fromAbsolute(absPosY),
    },
  });

  it("should behave like contain when object is larger on both axes", () => {
    const obj = getFakeObject(
      { top: 5, left: 3, width: 200, height: 150 },
      fabric,
    );
    const container = getScaleDownFittedObject(
      obj,
      makeOptions(100, 80, 10, 5),
      fabric,
    );
    const objectWrapper = obj.group as fabric.Group;

    expect(container.top).toBe(5);
    expect(container.left).toBe(3);

    const targetScaleFactor = Math.min(divideBy(100, 200), divideBy(80, 150));

    expect((obj.width ?? 0) * (obj.scaleX ?? 0)).toBeCloseTo(
      200 * targetScaleFactor,
    );
    expect((obj.height ?? 0) * (obj.scaleY ?? 0)).toBeCloseTo(
      150 * targetScaleFactor,
    );

    expect(objectWrapper.top).toBe(-80 / 2 + 5);
    expect(objectWrapper.left).toBe(-100 / 2 + 10);
  });

  it("should behave like contain when object is larger only on width", () => {
    const obj = getFakeObject(
      { top: 0, left: 0, width: 200, height: 50 },
      fabric,
    );
    getScaleDownFittedObject(obj, makeOptions(100, 80, 0, 0), fabric);

    const targetScaleFactor = Math.min(divideBy(100, 200), divideBy(80, 50));

    expect((obj.width ?? 0) * (obj.scaleX ?? 0)).toBeCloseTo(
      200 * targetScaleFactor,
    );
    expect((obj.height ?? 0) * (obj.scaleY ?? 0)).toBeCloseTo(
      50 * targetScaleFactor,
    );
  });

  it("should behave like contain when object is larger only on height", () => {
    const obj = getFakeObject(
      { top: 0, left: 0, width: 50, height: 200 },
      fabric,
    );
    getScaleDownFittedObject(obj, makeOptions(100, 80, 0, 0), fabric);

    const targetScaleFactor = Math.min(divideBy(100, 50), divideBy(80, 200));

    expect((obj.width ?? 0) * (obj.scaleX ?? 0)).toBeCloseTo(
      50 * targetScaleFactor,
    );
    expect((obj.height ?? 0) * (obj.scaleY ?? 0)).toBeCloseTo(
      200 * targetScaleFactor,
    );
  });

  it("should behave like none when object is smaller than container", () => {
    const obj = getFakeObject(
      { top: 2, left: 4, width: 50, height: 30 },
      fabric,
    );
    const container = getScaleDownFittedObject(
      obj,
      makeOptions(100, 80, 7, 3),
      fabric,
    );
    const objectWrapper = obj.group as fabric.Group;

    expect(container.top).toBe(2);
    expect(container.left).toBe(4);

    expect((obj.width ?? 0) * (obj.scaleX ?? 0)).toBe(50);
    expect((obj.height ?? 0) * (obj.scaleY ?? 0)).toBe(30);

    expect(objectWrapper.top).toBe(-80 / 2 + 3);
    expect(objectWrapper.left).toBe(-100 / 2 + 7);
  });

  it("should behave like none when object exactly matches container (boundary: > not >=)", () => {
    const obj = getFakeObject(
      { top: 0, left: 0, width: 100, height: 80 },
      fabric,
    );
    getScaleDownFittedObject(obj, makeOptions(100, 80, 0, 0), fabric);

    // scale should be 1 (none mode), not contain
    expect(obj.scaleX ?? 0).toBe(1);
    expect(obj.scaleY ?? 0).toBe(1);
  });
});
