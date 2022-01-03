import { fabric } from "fabric";

export const detachObjectFromGroup = (object: fabric.Object) => {
  if (object.group) {
    object.group.removeWithUpdate(object);
  }
};
