import type { FabricObject } from "fabric";
import type { IFabricNS } from "../types/IFabricNS";
import type { IGetFittedObjectPayload } from "../types/IGetFittedObjectPayload";
import { getContainFittedObject } from "./getContainFittedObject";
import { getNoneFittedObject } from "./getNoneFittedObject";

export const getScaleDownFittedObject = (
  object: FabricObject,
  options: IGetFittedObjectPayload,
  ns: IFabricNS,
) => {
  const { width, height } = options;

  const { width: objWidth = 0, height: objHeight = 0 } = object;

  if (objWidth > width || objHeight > height) {
    return getContainFittedObject(object, options, ns);
  }

  return getNoneFittedObject(object, options, ns);
};
