import { fromAbsolute } from "../../Point/fromAbsolute";
import { fromFactor } from "../../Point/fromFactor";
import { fromPercentage } from "../../Point/fromPercentage";
import { fromTag } from "../../Point/fromTag";
import { IPoint } from "../../types/IPoint";
import { IPointSerialized } from "../../types/IPointSerialized";
import { defaultPoint } from "./defaultPoint";

export const parsePoint = (
  serializedPoint: IPointSerialized,
  shouldFallbackToDefault = true
): IPoint => {
  try {
    switch (serializedPoint.type) {
      case "fromTag": {
        return fromTag(...serializedPoint.args);
      }

      case "fromAbsolute": {
        return fromAbsolute(...serializedPoint.args);
      }

      case "fromPercentage": {
        return fromPercentage(...serializedPoint.args);
      }

      case "fromFactor": {
        return fromFactor(...serializedPoint.args);
      }

      default: {
        const type = (serializedPoint as IPointSerialized).type;
        throw new Error(`The point type "${type}" are not implemented.`);
      }
    }
  } catch (_err) {
    if (!shouldFallbackToDefault) {
      throw _err;
    }
  }

  return defaultPoint;
};
