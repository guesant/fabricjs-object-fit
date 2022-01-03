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

  if (object.width! > width || object.height! > height) {
    return getContainFittedObject(object, options, ns);
  }

  return getNoneFittedObject(object, options, ns);
};
