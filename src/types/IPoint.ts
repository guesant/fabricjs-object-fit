import { IPointSerialized } from "./IPointSerialized";

export type IPoint = {
  getAbsolute(containerSize: number, objectSize: number): number;

  toJSON: () => IPointSerialized;
  toString?: () => string;
};
