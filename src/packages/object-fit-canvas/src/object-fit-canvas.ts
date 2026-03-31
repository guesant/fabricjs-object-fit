import type {
  IFitMode,
  ILayoutResult,
  IPosition,
} from "@guesant/object-fit.core";
import { FitMode } from "@guesant/object-fit.core";
import { drawObjectFit } from "./draw-object-fit";
import { resolveSourceSize } from "./resolve-source-size";
import type {
  ICanvasContext2D,
  ICanvasSource,
  IObjectFitCanvasOptions,
  IObjectFitCanvasSetSourceOptions,
} from "./types";

export class ObjectFitCanvas {
  mode: IFitMode;
  position: Partial<IPosition>;
  width: number;
  height: number;

  private _canvas: IObjectFitCanvasOptions["canvas"];
  private _ctx: ICanvasContext2D;
  private _source: ICanvasSource | null = null;
  private _sourceWidth = 0;
  private _sourceHeight = 0;
  private _layout: ILayoutResult | null = null;

  get source(): ICanvasSource | null {
    return this._source;
  }

  get sourceWidth(): number {
    return this._sourceWidth;
  }

  get sourceHeight(): number {
    return this._sourceHeight;
  }

  get layout(): ILayoutResult | null {
    return this._layout;
  }

  constructor(options: IObjectFitCanvasOptions) {
    this._canvas = options.canvas;
    this._ctx = this._canvas.getContext("2d") as ICanvasContext2D;
    this.mode = options.mode ?? FitMode.FILL;
    this.position = options.position ?? {};
    this.width = options.width ?? this._canvas.width;
    this.height = options.height ?? this._canvas.height;
  }

  setSource(
    source: ICanvasSource | null,
    options?: IObjectFitCanvasSetSourceOptions,
  ): void {
    this._source = source;

    if (source === null) {
      this._sourceWidth = 0;
      this._sourceHeight = 0;
      return;
    }

    const resolved = resolveSourceSize(
      source,
      options?.sourceWidth,
      options?.sourceHeight,
    );
    this._sourceWidth = resolved.width;
    this._sourceHeight = resolved.height;
  }

  render(): ILayoutResult | null {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    if (this._source === null) {
      this._layout = null;
      return null;
    }

    this._layout = drawObjectFit({
      ctx: this._ctx,
      source: this._source,
      sourceWidth: this._sourceWidth,
      sourceHeight: this._sourceHeight,
      containerWidth: this.width,
      containerHeight: this.height,
      mode: this.mode,
      position: this.position,
    });

    return this._layout;
  }

  update(
    options: Partial<
      Pick<ObjectFitCanvas, "mode" | "position" | "width" | "height">
    >,
  ): ILayoutResult | null {
    if (options.mode != null) this.mode = options.mode;
    if (options.position != null) this.position = options.position;
    if (options.width != null) this.width = options.width;
    if (options.height != null) this.height = options.height;
    return this.render();
  }

  static async fromURL(
    url: string,
    options: IObjectFitCanvasOptions,
  ): Promise<ObjectFitCanvas> {
    const img = new Image();
    img.src = url;
    return ObjectFitCanvas.fromImage(img, options);
  }

  static async fromImage(
    img: HTMLImageElement,
    options: IObjectFitCanvasOptions,
  ): Promise<ObjectFitCanvas> {
    if (!img.complete) {
      await new Promise<void>((resolve, reject) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", (e) => reject(e), { once: true });
      });
    }

    const instance = new ObjectFitCanvas(options);
    instance.setSource(img);
    instance.render();
    return instance;
  }
}
