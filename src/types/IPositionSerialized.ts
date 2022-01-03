import { IPointSerialized } from "./IPointSerialized";

export type IPositionSerialized = Partial<{
  x: IPointSerialized;
  y: IPointSerialized;
}>;
