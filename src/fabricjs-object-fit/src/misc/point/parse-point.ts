import { fromAbsolute } from "../../point/from-absolute";
import { fromFactor } from "../../point/from-factor";
import { fromPercentage } from "../../point/from-percentage";
import { fromTag } from "../../point/from-tag";
import type { IPoint } from "../../types/i-point";
import type { IPointSerialized } from "../../types/i-point-serialized";
import { defaultPoint } from "./default-point";

export const parsePoint = (
  serializedPoint: IPointSerialized,
  shouldFallbackToDefault = true,
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
