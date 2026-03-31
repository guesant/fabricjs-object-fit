import type { IPoint } from "../types/i-point";

/**
 * @param position absolute point
 * @returns IPoint
 */

export const fromAbsolute = (position: number): IPoint => ({
  getAbsolute: () => position,
  toString: () => `Point.fromAbsolute(${position})`,
  toJSON: () => ({
    type: "fromAbsolute",
    args: [position],
  }),
});
