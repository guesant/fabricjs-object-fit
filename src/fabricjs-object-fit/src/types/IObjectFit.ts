import type { fabric } from "fabric";
import type { IFitMode } from "./IFitMode";
import type { IObjectFitSerialized } from "./IObjectFitSerialized";
import type { IPosition } from "./IPosition";

export interface IObjectFit extends fabric.Group {
  type: string;

  mode: IFitMode;

  width: number;

  height: number;

  position: Partial<IPosition>;

  useObjectTransform: boolean;

  enableRecomputeOnScaled: boolean;

  enableRecomputeOnScaling: boolean;

  object: fabric.Object | null;

  setObject(
    object: fabric.Object | null,
    useObjectTransform?: boolean,
    restorePreviousObjectTransform?: boolean,
  ): void;

  detachObject(restorePreviousObjectTransform?: boolean): fabric.Object | null;

  handleScaled(shouldRenderCanvas?: boolean): void;

  recompute(): void;

  toObject(propertiesToInclude?: string[]): IObjectFitSerialized;
}
