import { getFakeObject } from "./Fabric/getFakeObject";
import { getObjectMaskedByRectangle } from "./getObjectMaskedByRectangle";
import { fabric } from "fabric";

it(getObjectMaskedByRectangle.name, () => {
  const INITIAL_OBJECT = {
    top: 10,
    left: 10,
    width: 100,
    height: 100
  };

  const INITIAL_MASK = {
    width: 40,
    height: 50
  };

  const object = getFakeObject({ ...INITIAL_OBJECT }, fabric);

  const masked = getObjectMaskedByRectangle(
    { object, ...INITIAL_MASK },
    fabric
  );

  expect(masked.top).toBe(0);
  expect(masked.left).toBe(0);
  expect(masked.getScaledWidth()).toBe(INITIAL_MASK.width);
  expect(masked.getScaledHeight()).toBe(INITIAL_MASK.height);

  expect(object.top).toBe(-masked.height! / 2 + INITIAL_OBJECT.top);
  expect(object.left).toBe(-masked.width! / 2 + INITIAL_OBJECT.left);
});
