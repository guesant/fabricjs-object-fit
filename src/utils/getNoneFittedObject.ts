import { fabric } from "fabric";
import { IFabricNS } from "../types/IFabricNS";
import { defaultPosition } from "../Position/defaultPosition";
import { fabricObjectDefaults } from "../misc/fabricObjectDefaults";
import { getObjectCoordsAndReset } from "../misc/getObjectCoordsAndReset";
import { IGetFittedObjectPayload } from "../types/IGetFittedObjectPayload";

export const getNoneFittedObject = (
  object: fabric.Object,
  options: IGetFittedObjectPayload,
  ns: IFabricNS
) => {
  const {
    width,
    height,
    position: { x = defaultPosition.x, y = defaultPosition.y } = {}
  } = options;

  const { left, top } = getObjectCoordsAndReset(object);

  object.scaleX = 1;
  object.scaleY = 1;

  const objectWrapper = new ns.Group([object], {
    ...fabricObjectDefaults
  });

  const [maskX, maskY] = [
    x.getAbsolute(object.width!, width),
    y.getAbsolute(object.height!, height)
  ];

  const objectMask = new ns.Rect({
    ...fabricObjectDefaults,
    width,
    height,
    top: -object.height! / 2 + maskY,
    left: -object.width! / 2 + maskX
  });

  objectWrapper.clipPath = objectMask;

  const group = new ns.Group(undefined, {
    ...fabricObjectDefaults,
    width,
    height,
    top: maskY,
    left: maskX
  });

  const groupMask = new ns.Rect({
    ...fabricObjectDefaults,
    width,
    height,
    top: -height / 2,
    left: -width / 2
  });

  group.add(objectWrapper);
  group._updateObjectsCoords();

  group.clipPath = groupMask;

  group.set({ left, top });
  group.setCoords();

  return group;
};
