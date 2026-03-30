import type { IPositionSerialized } from "../../types/i-position-serialized";
import { parsePoint } from "../point/parse-point";
import { defaultPosition } from "./default-position";

export const parsePosition = (serializedPosition: IPositionSerialized) => {
  const { x, y } = serializedPosition;
  return {
    x: x ? parsePoint(x) : defaultPosition.x,
    y: y ? parsePoint(y) : defaultPosition.y,
  };
};
