import { FitMode } from "../enums/FitMode";

export type IFitMode =
  | typeof FitMode["COVER"]
  | typeof FitMode["CONTAIN"]
  | typeof FitMode["FILL"]
  | typeof FitMode["NONE"]
  | typeof FitMode["SCALE_DOWN"];
