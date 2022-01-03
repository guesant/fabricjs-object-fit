import { fabric } from "fabric";

import { IGetFittedObjectPayload } from "../types/IGetFittedObjectPayload";

export const getFillFittedObject = (
  object: fabric.Object,
  options: IGetFittedObjectPayload
) => {
  const { width, height } = options;

  object.scaleX = width / object.width!;
  object.scaleY = height / object.height!;

  return object;
};
