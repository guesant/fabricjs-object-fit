import type { IPositionSerialized } from "../../types/IPositionSerialized";
import { parsePoint } from "../Point/parsePoint";
import { defaultPosition } from "./defaultPosition";

export const parsePosition = (serializedPosition: IPositionSerialized) => {
  const { x, y } = serializedPosition;
  return {
    x: x ? parsePoint(x) : defaultPosition.x,
    y: y ? parsePoint(y) : defaultPosition.y,
  };
};
