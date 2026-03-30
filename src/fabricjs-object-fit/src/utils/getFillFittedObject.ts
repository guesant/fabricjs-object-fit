import type { FabricObject } from "fabric";
import { divideBy } from "../misc/divideBy";
import { fabricObjectDefaults } from "../misc/Fabric/fabricObjectDefaults";
import { getObjectCoordsAndReset } from "../misc/Fabric/getObjectCoordsAndReset";
import { getObjectMaskedByRectangle } from "../misc/getObjectMaskedByRectangle";
import { defaultPosition } from "../misc/Position/defaultPosition";
import type { IFabricNS } from "../types/IFabricNS";
import type { IGetFittedObjectPayload } from "../types/IGetFittedObjectPayload";

export const getFillFittedObject = (
  object: FabricObject,
  options: IGetFittedObjectPayload,
  ns: IFabricNS,
) => {
  const {
    width,
    height,
    position: { x = defaultPosition.x, y = defaultPosition.y } = {},
  } = options;

  const { left, top } = getObjectCoordsAndReset(object);

  object.scaleX = divideBy(width, object.width ?? 0);
  object.scaleY = divideBy(height, object.height ?? 0);

  const objectWrapper = new ns.Group([object], {
    ...fabricObjectDefaults,
    layoutManager: new ns.LayoutManager(new ns.FixedLayout()),
  });

  objectWrapper.set({
    left: x.getAbsolute(width, objectWrapper.width ?? 0),
    top: y.getAbsolute(height, objectWrapper.height ?? 0),
  });

  objectWrapper.setCoords();

  const group = getObjectMaskedByRectangle(
    { width, height, object: objectWrapper },
    ns,
  );

  group.set({ left, top });
  group.setCoords();

  return group;
};
