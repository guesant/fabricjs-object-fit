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

  const objWrapper = new ns.Group([object], {
    ...fabricObjectDefaults
  });

  const objWrapperWidth = objWrapper.width! * objWrapper.scaleX!;
  const objWrapperHeight = objWrapper.height! * objWrapper.scaleY!;

  const [maskX, maskY] = [
    x.getAbsolute(objWrapperWidth, width),
    y.getAbsolute(objWrapperHeight, height)
  ];

  const objMask = new ns.Rect({
    ...fabricObjectDefaults,
    width,
    height,
    top: -objWrapperHeight / 2 + maskY,
    left: -objWrapperWidth / 2 + maskX
  });

  objWrapper.clipPath = objMask;

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

  group.add(objWrapper);
  group._updateObjectsCoords();

  group.clipPath = groupMask;

  group.set({ left, top });
  group.setCoords();

  return group;
};
