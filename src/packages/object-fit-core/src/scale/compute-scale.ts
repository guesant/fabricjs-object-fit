import { FitMode } from "../enums/fit-mode";
import type { IFitMode } from "../types/i-fit-mode";
import type { IScaleResult } from "../types/i-scale-result";
import type { ISize } from "../types/i-size";
import { divideBy } from "../util/divide-by";

export const computeFillScale = (
  container: ISize,
  object: ISize,
): IScaleResult => ({
  scaleX: divideBy(container.width, object.width),
  scaleY: divideBy(container.height, object.height),
});

export const computeCoverScale = (
  container: ISize,
  object: ISize,
): IScaleResult => {
  const scale = Math.max(
    divideBy(container.width, object.width),
    divideBy(container.height, object.height),
  );
  return { scaleX: scale, scaleY: scale };
};

export const computeContainScale = (
  container: ISize,
  object: ISize,
): IScaleResult => {
  const scale = Math.min(
    divideBy(container.width, object.width),
    divideBy(container.height, object.height),
  );
  return { scaleX: scale, scaleY: scale };
};

export const computeNoneScale = (
  _container: ISize,
  _object: ISize,
): IScaleResult => ({
  scaleX: 1,
  scaleY: 1,
});

export const computeScaleDownScale = (
  container: ISize,
  object: ISize,
): IScaleResult => {
  if (object.width > container.width || object.height > container.height) {
    return computeContainScale(container, object);
  }
  return computeNoneScale(container, object);
};

export const computeScale = (
  mode: IFitMode,
  container: ISize,
  object: ISize,
): IScaleResult => {
  switch (mode) {
    case FitMode.FILL:
      return computeFillScale(container, object);
    case FitMode.COVER:
      return computeCoverScale(container, object);
    case FitMode.CONTAIN:
      return computeContainScale(container, object);
    case FitMode.NONE:
      return computeNoneScale(container, object);
    case FitMode.SCALE_DOWN:
      return computeScaleDownScale(container, object);
  }
};
