import { fabric } from "fabric";
import { IFabricNS } from "../types/IFabricNS";

export const getEnlivedObject = (
  object: Partial<fabric.Object> | null | undefined,
  callback: (enlivedObject: fabric.Object | null) => void,
  ns: IFabricNS
) => {
  if (object) {
    ns.util.enlivenObjects(
      [object],
      ([enlivedObject]: [fabric.Object]) => {
        callback(enlivedObject);
      },
      undefined as any
    );
  } else {
    callback(null);
  }
};
