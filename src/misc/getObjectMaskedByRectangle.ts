import { fabric } from "fabric";
import { IFabricNS } from "../types/IFabricNS";
import { divideBy } from "./divideBy";
import { fabricObjectDefaults } from "./Fabric/fabricObjectDefaults";

export type IGetObjectMaskedByRectangleOptions = {
  width: number;
  height: number;
  object: fabric.Object;
};

export const getObjectMaskedByRectangle = (
  options: IGetObjectMaskedByRectangleOptions,
  ns: IFabricNS
) => {
  const { width, height, object } = options;

  const group = new ns.Group(undefined, {
    ...fabricObjectDefaults,
    width,
    height
  });

  const groupMask = new ns.Rect({
    ...fabricObjectDefaults,
    width,
    height,
    top: -divideBy(height, 2),
    left: -divideBy(width, 2)
  });

  group.add(object);
  group._updateObjectsCoords();

  group.clipPath = groupMask;

  group.setCoords();

  return group;
};
