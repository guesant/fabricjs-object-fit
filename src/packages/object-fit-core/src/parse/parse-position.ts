import type { IPositionSerialized } from "../types/i-position-serialized";
import { defaultPosition } from "./default-position";
import { parsePoint } from "./parse-point";

export const parsePosition = (serializedPosition: IPositionSerialized) => {
  const { x, y } = serializedPosition;
  return {
    x: x ? parsePoint(x) : defaultPosition.x,
    y: y ? parsePoint(y) : defaultPosition.y,
  };
};
