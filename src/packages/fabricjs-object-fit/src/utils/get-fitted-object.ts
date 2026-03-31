import { FitMode } from "@guesant/object-fit.core";
import type { FabricObject } from "fabric";
import type { IFabricNS } from "../types/i-fabric-ns";
import type { IGetFittedObjectOptions } from "../types/i-get-fitted-object-options";
import { getContainFittedObject } from "./get-contain-fitted-object";
import { getCoverFittedObject } from "./get-cover-fitted-object";
import { getFillFittedObject } from "./get-fill-fitted-object";
import { getNoneFittedObject } from "./get-none-fitted-object";
import { getScaleDownFittedObject } from "./get-scale-down-fitted-object";

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
