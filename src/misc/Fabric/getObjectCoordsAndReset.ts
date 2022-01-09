import { fabric } from "fabric";
import { fabricObjectDefaults } from "./fabricObjectDefaults";

export const getObjectCoordsAndReset = (object: fabric.Object) => {
  const { left = 0, top = 0 } = object;

  object.set({ ...fabricObjectDefaults, left: 0, top: 0 });
  object.setCoords();

  return { left, top };
};
