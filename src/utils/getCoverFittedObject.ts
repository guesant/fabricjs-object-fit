import { fabric } from "fabric";
import { divideBy } from "../misc/divideBy";
import { fabricObjectDefaults } from "../misc/Fabric/fabricObjectDefaults";
import { getObjectCoordsAndReset } from "../misc/Fabric/getObjectCoordsAndReset";
import { getObjectMaskedByRectangle } from "../misc/getObjectMaskedByRectangle";
import { defaultPosition } from "../misc/Position/defaultPosition";
import { IFabricNS } from "../types/IFabricNS";
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
    divideBy(width, object.width!),
    divideBy(height, object.height!)
  );

  object.scaleX = targetScaleFactor;
  object.scaleY = targetScaleFactor;

  const objectWrapper = new ns.Group([object], { ...fabricObjectDefaults });

  objectWrapper.set({
    left: x.getAbsolute(width, objectWrapper.width!),
    top: y.getAbsolute(height, objectWrapper.height!)
  });

  objectWrapper.setCoords();

  const group = getObjectMaskedByRectangle(
    { width, height, object: objectWrapper },
    ns
  );

  group.set({ left, top });
  group.setCoords();

  return group;
};
