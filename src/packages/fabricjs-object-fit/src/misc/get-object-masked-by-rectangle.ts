import { divideBy } from "@guesant/object-fit.core";
import type { FabricObject } from "fabric";
import type { IFabricNS } from "../types/i-fabric-ns";
import { fabricObjectDefaults } from "./fabric/fabric-object-defaults";

export type IGetObjectMaskedByRectangleOptions = {
  width: number;
  height: number;
  object: FabricObject;
};

export const getObjectMaskedByRectangle = (
  options: IGetObjectMaskedByRectangleOptions,
  ns: IFabricNS,
) => {
  const { width, height, object } = options;

  const group = new ns.Group([], {
    ...fabricObjectDefaults,
    width,
    height,
    layoutManager: new ns.LayoutManager(new ns.FixedLayout()),
  });

  const groupMask = new ns.Rect({
    ...fabricObjectDefaults,
    width,
    height,
    top: -divideBy(height, 2),
    left: -divideBy(width, 2),
  });

  group.add(object);

  group.clipPath = groupMask;

  group.setCoords();

  return group;
};
