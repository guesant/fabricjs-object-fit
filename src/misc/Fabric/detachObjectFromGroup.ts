import { fabric } from "fabric";

export const detachObjectFromGroup = (object: fabric.Object) => {
  object.group?.removeWithUpdate(object);
};
