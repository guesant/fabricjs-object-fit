import { IPoint } from "../types/IPoint";
import { IPointSerialized } from "../types/IPointSerialized";
import { fromAbsolute } from "./fromAbsolute";
import { fromFactor } from "./fromFactor";
import { fromPercentage } from "./fromPercentage";
import { fromTag } from "./fromTag";

export const parsePointSerialized = (
  pointSerialized: IPointSerialized
): IPoint => {
  switch (pointSerialized.type) {
    case "fromTag":
      return fromTag(...pointSerialized.args);

    case "fromAbsolute":
      return fromAbsolute(...pointSerialized.args);

    case "fromPercentage":
      return fromPercentage(...pointSerialized.args);

    case "fromFactor":
      return fromFactor(...pointSerialized.args);
  }
};
