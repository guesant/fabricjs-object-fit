import { fabric } from "fabric";
import { IFabricNS } from "../types/IFabricNS";
import { IGetFittedObjectPayload } from "../types/IGetFittedObjectPayload";
import { getContainFittedObject } from "./getContainFittedObject";
import { getNoneFittedObject } from "./getNoneFittedObject";

export const getScaleDownFittedObject = (
  object: fabric.Object,
  options: IGetFittedObjectPayload,
  ns: IFabricNS
) => {
  const { width, height } = options;

  const { width: objWidth = 0, height: objHeight = 0 } = object;

  if (objWidth > width || objHeight > height) {
    return getContainFittedObject(object, options, ns);
  }

  return getNoneFittedObject(object, options, ns);
};
