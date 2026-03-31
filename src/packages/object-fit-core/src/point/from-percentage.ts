/**
 * @param percentage string (e.g. "25%") or number (e.g. 90)
 * @returns IPoint
 */

import type { IPoint } from "../types/i-point";
import { divideBy } from "../util/divide-by";
import { fromFactor } from "./from-factor";

export const fromPercentage = (percentage: number | string): IPoint => ({
  ...fromFactor(
    divideBy(
      typeof percentage === "string" ? parseInt(percentage, 10) : percentage,
      100,
    ),
  ),
  toString: () => `Point.fromPercentage(${percentage})`,
  toJSON: () => ({
    type: "fromPercentage",
    args: [percentage],
  }),
});
