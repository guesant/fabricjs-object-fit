import type { FabricObject } from "fabric";

export const detachObjectFromGroup = (object: FabricObject) => {
  object.group?.remove(object);
};
