import { fabric } from "fabric";
import { getFakeObject } from "../misc/Fabric/getFakeObject";
import { fromAbsolute } from "../Point";
import { getNoneFittedObject } from "./getNoneFittedObject";

describe(getNoneFittedObject.name, () => {
  it("should not scale the object", () => {
    const INITIAL_OBJECT = {
      top: 3,
      left: 7,
      width: 103,
      height: 107
    };

    const INITIAL_CONTAINER = {
      width: 207,
      height: 91,
      absPosX: 11,
      absPosY: 19
    };

    const obj = getFakeObject({ ...INITIAL_OBJECT }, fabric);

    const container = getNoneFittedObject(
      obj,
      {
        ...INITIAL_CONTAINER,
        position: {
          x: fromAbsolute(INITIAL_CONTAINER.absPosX),
          y: fromAbsolute(INITIAL_CONTAINER.absPosY)
        }
      },
      fabric
    );

    const objectWrapper = obj.group!;

    expect(container.top).toBe(INITIAL_OBJECT.top);
    expect(container.left).toBe(INITIAL_OBJECT.left);

    expect(obj.width! * obj.scaleX!).toBe(INITIAL_OBJECT.width);
    expect(obj.height! * obj.scaleY!).toBe(INITIAL_OBJECT.height);

    expect(objectWrapper.top).toBe(
      -INITIAL_CONTAINER.height / 2 + INITIAL_CONTAINER.absPosY
    );
    expect(objectWrapper.left).toBe(
      -INITIAL_CONTAINER.width / 2 + INITIAL_CONTAINER.absPosX
    );
  });

  it("should always set scale to 1", () => {
    const obj = getFakeObject({ top: 0, left: 0, width: 50, height: 30 }, fabric);
    getNoneFittedObject(
      obj,
      { width: 200, height: 200, position: { x: fromAbsolute(0), y: fromAbsolute(0) } },
      fabric
    );

    expect(obj.scaleX!).toBe(1);
    expect(obj.scaleY!).toBe(1);
  });

  it("should use default center position when position is omitted", () => {
    const obj = getFakeObject({ top: 0, left: 0, width: 100, height: 50 }, fabric);
    const container = getNoneFittedObject(
      obj,
      { width: 200, height: 200 },
      fabric
    );

    expect(container).toBeDefined();
  });

  it("should handle object larger than container", () => {
    const obj = getFakeObject({ top: 0, left: 0, width: 500, height: 500 }, fabric);
    getNoneFittedObject(
      obj,
      { width: 100, height: 100, position: { x: fromAbsolute(0), y: fromAbsolute(0) } },
      fabric
    );

    // Scale stays 1 regardless
    expect(obj.scaleX!).toBe(1);
    expect(obj.scaleY!).toBe(1);
  });
});
