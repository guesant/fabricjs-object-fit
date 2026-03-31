export type {
  IComputeLayoutOptions,
  IFitMode,
  ILayoutResult,
  IPoint,
  IPointSerialized,
  IPosition,
  IPositionSerialized,
  IScaleResult,
  ISize,
} from "@guesant/object-fit.core";
export {
  computeContainScale,
  computeCoverScale,
  computeFillScale,
  computeLayout,
  computeNoneScale,
  computeScale,
  computeScaleDownScale,
  defaultPoint,
  defaultPosition,
  FitMode,
  fromAbsolute,
  fromFactor,
  fromPercentage,
  fromTag,
  Point,
  parsePoint,
  parsePosition,
  Tag,
  X,
  Y,
} from "@guesant/object-fit.core";

export { drawObjectFit } from "./draw-object-fit";
export { ObjectFitCanvas } from "./object-fit-canvas";
export type {
  ICanvasContext2D,
  ICanvasSource,
  IDrawObjectFitOptions,
  IObjectFitCanvasOptions,
  IObjectFitCanvasSetSourceOptions,
} from "./types";
