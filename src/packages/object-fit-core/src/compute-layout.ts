import { defaultPosition } from "./parse/default-position";
import { computeScale } from "./scale/compute-scale";
import type { IComputeLayoutOptions } from "./types/i-compute-layout-options";
import type { ILayoutResult } from "./types/i-layout-result";

export const computeLayout = (
  options: IComputeLayoutOptions,
): ILayoutResult => {
  const {
    mode,
    container,
    object,
    position: { x = defaultPosition.x, y = defaultPosition.y } = {},
  } = options;

  const { scaleX, scaleY } = computeScale(mode, container, object);

  const scaledWidth = object.width * scaleX;
  const scaledHeight = object.height * scaleY;

  return {
    x: x.getAbsolute(container.width, scaledWidth),
    y: y.getAbsolute(container.height, scaledHeight),
    width: scaledWidth,
    height: scaledHeight,
    scaleX,
    scaleY,
    clipX: 0,
    clipY: 0,
    clipWidth: container.width,
    clipHeight: container.height,
  };
};
