import type { FitMode } from "../enums/fit-mode";

export type IFitMode =
  | (typeof FitMode)["COVER"]
  | (typeof FitMode)["CONTAIN"]
  | (typeof FitMode)["FILL"]
  | (typeof FitMode)["NONE"]
  | (typeof FitMode)["SCALE_DOWN"];
