import { parsePointSerialized } from "../Point";
import { defaultPosition } from "../Position/defaultPosition";
import { IPositionSerialized } from "../types/IPositionSerialized";

export const parsePositionSerialized = (
  serializedPosition: IPositionSerialized
) => {
  return {
    x: serializedPosition.x
      ? parsePointSerialized(serializedPosition.x)
      : defaultPosition.x,
    y: serializedPosition.y
      ? parsePointSerialized(serializedPosition.y)
      : defaultPosition.y
  };
};
