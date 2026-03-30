import type { IPointSerialized } from "./i-point-serialized";

export type IPositionSerialized = Partial<{
  x: IPointSerialized;
  y: IPointSerialized;
}>;
