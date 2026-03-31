import type { IPointSerialized } from "./i-point-serialized";

export type IPoint = {
  getAbsolute(containerSize: number, objectSize: number): number;

  toJSON: () => IPointSerialized;
  toString?: () => string;
};
