import type { ILayoutResult } from "@guesant/object-fit.core";
import { computeLayout } from "@guesant/object-fit.core";
import { resolveSourceSize } from "./resolve-source-size";
import type { IDrawObjectFitOptions } from "./types";

export const drawObjectFit = (
  options: IDrawObjectFitOptions,
): ILayoutResult => {
  const {
    ctx,
    source,
    containerWidth,
    containerHeight,
    mode,
    position,
    containerX = 0,
    containerY = 0,
  } = options;

  const { width: sourceWidth, height: sourceHeight } = resolveSourceSize(
    source,
    options.sourceWidth,
    options.sourceHeight,
  );

  const layout = computeLayout({
    mode,
    container: { width: containerWidth, height: containerHeight },
    object: { width: sourceWidth, height: sourceHeight },
    position,
  });

  ctx.save();
  ctx.beginPath();
  ctx.rect(
    containerX + layout.clipX,
    containerY + layout.clipY,
    layout.clipWidth,
    layout.clipHeight,
  );
  ctx.clip();
  ctx.drawImage(
    source,
    containerX + layout.x,
    containerY + layout.y,
    layout.width,
    layout.height,
  );
  ctx.restore();

  return layout;
};
