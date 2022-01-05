import { fabric } from "fabric";
import { IFitMode } from "./IFitMode";
import { IObjectFitSerialized } from "./IObjectFitSerialized";
import { IPosition } from "./IPosition";

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
    restorePreviousObjectTransform?: boolean
  ): void;

  detachObject(restorePreviousObjectTransform?: boolean): fabric.Object | null;

  handleScaled(shouldRenderCanvas?: boolean): void;

  recompute(): void;

  toObject(): IObjectFitSerialized;
}
