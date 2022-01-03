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

  const group = new ns.Group(undefined, {
    ...fabricObjectDefaults,
    top,
    left,
    width,
    height
  });

  group.add(objectWrapper);
  group._updateObjectsCoords();
  group.setCoords();

  const mask = new ns.Rect({
    ...fabricObjectDefaults,
    width,
    height,
    left: -width / 2,
    top: -height / 2
  });

  group.clipPath = mask;

  const [posX, posY] = [
    x.getAbsolute(width, objectWrapper.width!),
    y.getAbsolute(height, objectWrapper.height!)
  ];

  objectWrapper.set({
    left: posX - width / 2,
    top: posY - height / 2
  });

  return group;
};
