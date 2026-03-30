import type { FabricObject } from "fabric";
import { fabricObjectDefaults } from "./fabric-object-defaults";

export const getObjectCoordsAndReset = (object: FabricObject) => {
  const { left = 0, top = 0 } = object;

  object.set({ ...fabricObjectDefaults, left: 0, top: 0 });
  object.setCoords();

  return { left, top };
};
