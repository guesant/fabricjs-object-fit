import { fabric } from "fabric";
import { IFabricNS } from "../types/IFabricNS";
import { defaultPosition } from "../Position/defaultPosition";
import { fabricObjectDefaults } from "../misc/fabricObjectDefaults";
import { getObjectCoordsAndReset } from "../misc/getObjectCoordsAndReset";
import { IGetFittedObjectPayload } from "../types/IGetFittedObjectPayload";

export const getCoverFittedObject = (
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

  const targetScaleFactor = Math.max(
    width / object.width!,
    height / object.height!
  );

  object.scaleX = targetScaleFactor;
  object.scaleY = targetScaleFactor;

  const objectWrapper = new ns.Group([object], {
    ...fabricObjectDefaults
  });

  objectWrapper.set({
    left: x.getAbsolute(objectWrapper.width!, width),
    top: y.getAbsolute(objectWrapper.height!, height)
  });

  objectWrapper.setCoords();

  const group = new ns.Group(undefined, {
    ...fabricObjectDefaults,
    width,
    height
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
