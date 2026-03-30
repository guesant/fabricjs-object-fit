import type { FabricObject } from "fabric";
import { FitMode } from "../enums/FitMode";
import type { IFabricNS } from "../types/IFabricNS";
import type { IGetFittedObjectOptions } from "../types/IGetFittedObjectOptions";
import { getContainFittedObject } from "./getContainFittedObject";
import { getCoverFittedObject } from "./getCoverFittedObject";
import { getFillFittedObject } from "./getFillFittedObject";
import { getNoneFittedObject } from "./getNoneFittedObject";
import { getScaleDownFittedObject } from "./getScaleDownFittedObject";

export const getFittedObject = (
  object: FabricObject,
  options: IGetFittedObjectOptions,
  ns: IFabricNS,
): FabricObject | undefined => {
  const { mode, ...payload } = options;

  switch (mode) {
    case FitMode.COVER: {
      return getCoverFittedObject(object, payload, ns);
    }

    case FitMode.CONTAIN: {
      return getContainFittedObject(object, payload, ns);
    }

    case FitMode.FILL: {
      return getFillFittedObject(object, payload, ns);
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
