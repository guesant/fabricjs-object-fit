import { fabric } from "fabric";
import { getFakeObject } from "../misc/Fabric/getFakeObject";
import { fromAbsolute } from "../Point";
import { getNoneFittedObject } from "./getNoneFittedObject";

test(getNoneFittedObject.name, () => {
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
