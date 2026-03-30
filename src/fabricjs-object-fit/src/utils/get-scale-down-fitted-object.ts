import type { FabricObject } from "fabric";
import type { IFabricNS } from "../types/i-fabric-ns";
import type { IGetFittedObjectPayload } from "../types/i-get-fitted-object-payload";
import { getContainFittedObject } from "./get-contain-fitted-object";
import { getNoneFittedObject } from "./get-none-fitted-object";

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
