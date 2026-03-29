import { fabric } from "fabric";
import { getFakeObject } from "../misc/Fabric/getFakeObject";
import { fromAbsolute, fromTag } from "../Point";
import { Tag } from "../enums/Tag";
import { getFillFittedObject } from "./getFillFittedObject";

describe(getFillFittedObject.name, () => {
  it("should stretch object to fill container", () => {
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

    const container = getFillFittedObject(
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

    expect(object.width! * object.scaleX!).toBeCloseTo(INITIAL_CONTAINER.width);
    expect(object.height! * object.scaleY!).toBeCloseTo(INITIAL_CONTAINER.height);

    expect(objectWrapper.top).toBe(
      -INITIAL_CONTAINER.height / 2 + INITIAL_CONTAINER.absPosY
    );
    expect(objectWrapper.left).toBe(
      -INITIAL_CONTAINER.width / 2 + INITIAL_CONTAINER.absPosX
    );
  });

  it("should handle square object in square container", () => {
    const obj = getFakeObject({ top: 0, left: 0, width: 100, height: 100 }, fabric);
    getFillFittedObject(
      obj,
      { width: 200, height: 200, position: { x: fromAbsolute(0), y: fromAbsolute(0) } },
      fabric
    );

    expect(obj.scaleX!).toBeCloseTo(2);
    expect(obj.scaleY!).toBeCloseTo(2);
  });

  it("should handle tag-based position", () => {
    const obj = getFakeObject({ top: 0, left: 0, width: 100, height: 50 }, fabric);
    const container = getFillFittedObject(
      obj,
      { width: 200, height: 100, position: { x: fromTag(Tag.CENTER), y: fromTag(Tag.CENTER) } },
      fabric
    );

    // Container should be created without crashing
    expect(container).toBeDefined();
  });

  it("should use default center position when position is omitted", () => {
    const obj = getFakeObject({ top: 0, left: 0, width: 100, height: 50 }, fabric);
    const container = getFillFittedObject(
      obj,
      { width: 200, height: 100 },
      fabric
    );

    // Should not crash, default position is center
    expect(container).toBeDefined();
  });
});
