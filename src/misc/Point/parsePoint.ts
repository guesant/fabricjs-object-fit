import { IPoint } from "../../types/IPoint";
import { IPointSerialized } from "../../types/IPointSerialized";
import { fromAbsolute } from "../../Point/fromAbsolute";
import { fromFactor } from "../../Point/fromFactor";
import { fromPercentage } from "../../Point/fromPercentage";
import { fromTag } from "../../Point/fromTag";

export const parsePoint = (serializedPoint: IPointSerialized): IPoint => {
  switch (serializedPoint.type) {
    case "fromTag":
      return fromTag(...serializedPoint.args);

    case "fromAbsolute":
      return fromAbsolute(...serializedPoint.args);

    case "fromPercentage":
      return fromPercentage(...serializedPoint.args);

    case "fromFactor":
      return fromFactor(...serializedPoint.args);
  }
};
