import { fabric } from "fabric";
import { divideBy } from "../misc/divideBy";
import { getFakeObject } from "../misc/Fabric/getFakeObject";
import { fromAbsolute } from "../Point";
import { getCoverFittedObject } from "./getCoverFittedObject";

it(getCoverFittedObject.name, () => {
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

  const container = getCoverFittedObject(
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

  const targetScaleFactor = Math.max(
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
