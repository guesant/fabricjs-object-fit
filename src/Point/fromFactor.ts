import { IPoint } from "../types/IPoint";

/**
 * @param factor
 * @returns IPoint
 */

export const fromFactor = (factor: number): IPoint => ({
  getAbsolute: (containerSize, objectSize) =>
    (containerSize - objectSize) * factor,

  toString: () => `#<Point.fromFactor(${factor})>`,

  toJSON: () => ({
    type: "fromFactor",
    args: [factor]
  })
});
