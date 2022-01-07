import { fabric } from "fabric";
import { getFakeObject } from "../misc/Fabric/getFakeObject";
import { fromAbsolute } from "../Point";
import { getFillFittedObject } from "./getFillFittedObject";

test(getFillFittedObject.name, () => {
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
