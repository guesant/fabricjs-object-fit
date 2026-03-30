import type { FabricObject } from "fabric";
import { divideBy } from "../misc/divide-by";
import { fabricObjectDefaults } from "../misc/fabric/fabric-object-defaults";
import { getObjectCoordsAndReset } from "../misc/fabric/get-object-coords-and-reset";
import { getObjectMaskedByRectangle } from "../misc/get-object-masked-by-rectangle";
import { defaultPosition } from "../misc/position/default-position";
import type { IFabricNS } from "../types/i-fabric-ns";
import type { IGetFittedObjectPayload } from "../types/i-get-fitted-object-payload";

export const getCoverFittedObject = (
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

  const targetScaleFactor = Math.max(
    divideBy(width, object.width ?? 0),
    divideBy(height, object.height ?? 0),
  );

  object.scaleX = targetScaleFactor;
  object.scaleY = targetScaleFactor;

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
