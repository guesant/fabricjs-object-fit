import { fabric } from "fabric";
import { FitMode } from "../enums/FitMode";
import { IFabricNS } from "../types/IFabricNS";
import { IGetFittedObjectOptions } from "../types/IGetFittedObjectOptions";
import { getContainFittedObject } from "./getContainFittedObject";
import { getCoverFittedObject } from "./getCoverFittedObject";
import { getFillFittedObject } from "./getFillFittedObject";
import { getNoneFittedObject } from "./getNoneFittedObject";
import { getScaleDownFittedObject } from "./getScaleDownFittedObject";

export const getFittedObject = (
  object: fabric.Object,
  options: IGetFittedObjectOptions,
  ns: IFabricNS
): fabric.Object | void => {
  const { mode, ...payload } = options;

  switch (mode) {
    case FitMode.COVER: {
      return getCoverFittedObject(object, payload, ns);
    }

    case FitMode.CONTAIN: {
      return getContainFittedObject(object, payload, ns);
    }

    case FitMode.FILL: {
      return getFillFittedObject(object, payload);
    }

    case FitMode.NONE: {
      return getNoneFittedObject(object, payload, ns);
    }

    case FitMode.SCALE_DOWN: {
      return getScaleDownFittedObject(object, payload, ns);
    }

    default: {
      throw new Error(`The fit mode "${mode}" are not implemented.`);
    }
  }
};
