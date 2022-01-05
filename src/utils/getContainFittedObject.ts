import { fabric } from "fabric";
import { IFabricNS } from "../types/IFabricNS";
import { defaultPosition } from "../Position/defaultPosition";
import { fabricObjectDefaults } from "../misc/fabricObjectDefaults";
import { getObjectCoordsAndReset } from "../misc/getObjectCoordsAndReset";
import { IGetFittedObjectPayload } from "../types/IGetFittedObjectPayload";

export const getContainFittedObject = (
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

  const targetScaleFactor = Math.min(
    width / object.width!,
    height / object.height!
  );

  object.scaleX = targetScaleFactor;
  object.scaleY = targetScaleFactor;

  const objectWrapper = new ns.Group([object], { ...fabricObjectDefaults });

  objectWrapper.set({
    left: x.getAbsolute(width, objectWrapper.width!),
    top: y.getAbsolute(height, objectWrapper.height!)
  });

  objectWrapper.setCoords();

  const group = new ns.Group(undefined, {
    ...fabricObjectDefaults,
    top,
    left,
    width,
    height
  });

  const groupMask = new ns.Rect({
    ...fabricObjectDefaults,
    width,
    height,
    left: -width / 2,
    top: -height / 2
  });

  group.add(objectWrapper);
  group._updateObjectsCoords();

  group.clipPath = groupMask;

  group.setCoords();

  return group;
};
