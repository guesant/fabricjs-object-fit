import type { ICanvasSource } from "./types";

export const resolveSourceSize = (
  source: ICanvasSource,
  explicitWidth?: number,
  explicitHeight?: number,
): { width: number; height: number } => {
  if (explicitWidth != null && explicitHeight != null) {
    return { width: explicitWidth, height: explicitHeight };
  }

  let width = explicitWidth;
  let height = explicitHeight;

  if (
    typeof HTMLImageElement !== "undefined" &&
    source instanceof HTMLImageElement
  ) {
    width ??= source.naturalWidth;
    height ??= source.naturalHeight;
  } else if (
    typeof HTMLVideoElement !== "undefined" &&
    source instanceof HTMLVideoElement
  ) {
    width ??= source.videoWidth;
    height ??= source.videoHeight;
  } else if (
    typeof SVGImageElement !== "undefined" &&
    source instanceof SVGImageElement
  ) {
    const bbox = source.getBBox();
    width ??= bbox.width;
    height ??= bbox.height;
  } else {
    width ??= source.width;
    height ??= source.height;
  }

  return { width, height };
};
