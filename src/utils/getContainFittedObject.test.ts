import { fabric } from "fabric";
import { divideBy } from "../misc/divideBy";
import { getFakeObject } from "../misc/Fabric/getFakeObject";
import { fromAbsolute } from "../Point";
import { getContainFittedObject } from "./getContainFittedObject";

describe(getContainFittedObject.name, () => {
  it("should scale uniformly using Math.min", () => {
    const INITIAL_OBJECT = {
      top: 13,
      left: 3,
      width: 103,
      height: 67
    };

    const INITIAL_CONTAINER = {
      width: 11,
      height: 109,
      absPosX: 11,
      absPosY: 7
    };

    const object = getFakeObject({ ...INITIAL_OBJECT }, fabric);

    const container = getContainFittedObject(
      object,
      {
        ...INITIAL_CONTAINER,
        position: {
          x: fromAbsolute(INITIAL_CONTAINER.absPosX),
          y: fromAbsolute(INITIAL_CONTAINER.absPosY)
        }
      },
      fabric
    );

    const objectWrapper = object.group!;

    expect(container.top).toBe(INITIAL_OBJECT.top);
    expect(container.left).toBe(INITIAL_OBJECT.left);

    const targetScaleFactor = Math.min(
      divideBy(INITIAL_CONTAINER.width, INITIAL_OBJECT.width),
      divideBy(INITIAL_CONTAINER.height, INITIAL_OBJECT.height)
    );

    expect(object.width! * object.scaleX!).toBeCloseTo(
      INITIAL_OBJECT.width * targetScaleFactor
    );
    expect(object.height! * object.scaleY!).toBeCloseTo(
      INITIAL_OBJECT.height * targetScaleFactor
    );

    expect(objectWrapper.top).toBe(
      -INITIAL_CONTAINER.height / 2 + INITIAL_CONTAINER.absPosY
    );

    expect(objectWrapper.left).toBe(
      -INITIAL_CONTAINER.width / 2 + INITIAL_CONTAINER.absPosX
    );
  });

  it("should handle wide object in tall container", () => {
    const obj = getFakeObject({ top: 0, left: 0, width: 400, height: 100 }, fabric);
    getContainFittedObject(
      obj,
      { width: 200, height: 400, position: { x: fromAbsolute(0), y: fromAbsolute(0) } },
      fabric
    );

    // min(200/400, 400/100) = min(0.5, 4) = 0.5
    expect(obj.scaleX!).toBeCloseTo(0.5);
    expect(obj.scaleY!).toBeCloseTo(0.5);
  });

  it("should use default center position when position is omitted", () => {
    const obj = getFakeObject({ top: 0, left: 0, width: 100, height: 50 }, fabric);
    const container = getContainFittedObject(
      obj,
      { width: 200, height: 200 },
      fabric
    );

    expect(container).toBeDefined();
  });

  it("should handle square object in square container", () => {
    const obj = getFakeObject({ top: 0, left: 0, width: 100, height: 100 }, fabric);
    getContainFittedObject(
      obj,
      { width: 50, height: 50, position: { x: fromAbsolute(0), y: fromAbsolute(0) } },
      fabric
    );

    expect(obj.scaleX!).toBeCloseTo(0.5);
    expect(obj.scaleY!).toBeCloseTo(0.5);
  });
});
