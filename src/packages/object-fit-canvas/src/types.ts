import type { IFitMode, IPosition } from "@guesant/object-fit.core";

/** Minimal 2D context interface compatible with both DOM and node-canvas. */
export interface ICanvasContext2D {
  save(): void;
  restore(): void;
  beginPath(): void;
  rect(x: number, y: number, w: number, h: number): void;
  clip(): void;
  clearRect(x: number, y: number, w: number, h: number): void;
  drawImage(
    image: ICanvasSource,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ): void;
}

/** Minimal canvas source interface compatible with both DOM and node-canvas. */
export interface ICanvasSource {
  readonly width: number;
  readonly height: number;
}

export type IDrawObjectFitOptions = {
  /** The 2D rendering context to draw into */
  ctx: ICanvasContext2D;
  /** The image/video/canvas to draw */
  source: ICanvasSource;
  /** Intrinsic (natural) width of the source. Auto-detected from source.width if omitted. */
  sourceWidth?: number;
  /** Intrinsic (natural) height of the source. Auto-detected from source.height if omitted. */
  sourceHeight?: number;
  /** Container width (the region to fit into) */
  containerWidth: number;
  /** Container height */
  containerHeight: number;
  /** Fit mode */
  mode: IFitMode;
  /** Position within the container */
  position?: Partial<IPosition>;
  /** Container origin X on the canvas (default: 0) */
  containerX?: number;
  /** Container origin Y on the canvas (default: 0) */
  containerY?: number;
};

export type IObjectFitCanvasOptions = {
  /** The canvas element to render into (HTMLCanvasElement, OffscreenCanvas, or node-canvas) */
  canvas: {
    width: number;
    height: number;
    getContext(id: "2d"): ICanvasContext2D | null;
  };
  /** Fit mode (default: "fill") */
  mode?: IFitMode;
  /** Position (default: center/center) */
  position?: Partial<IPosition>;
  /** Container width override; defaults to canvas.width */
  width?: number;
  /** Container height override; defaults to canvas.height */
  height?: number;
};

export type IObjectFitCanvasSetSourceOptions = {
  /** Natural width of the source. Auto-detected from source.width if omitted. */
  sourceWidth?: number;
  /** Natural height of the source. Auto-detected from source.height if omitted. */
  sourceHeight?: number;
};
