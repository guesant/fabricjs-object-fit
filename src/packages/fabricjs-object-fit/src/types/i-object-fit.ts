import type { IFitMode, IPosition } from "@guesant/object-fit.core";
import type { FabricObject, Group } from "fabric";

export interface IObjectFit extends Group {
  type: string;

  mode: IFitMode;

  width: number;

  height: number;

  position: Partial<IPosition>;

  useObjectTransform: boolean;

  enableRecomputeOnScaled: boolean;

  enableRecomputeOnScaling: boolean;

  object: FabricObject | null;

  setObject(
    object: FabricObject | null,
    useObjectTransform?: boolean,
    restorePreviousObjectTransform?: boolean,
  ): void;

  detachObject(restorePreviousObjectTransform?: boolean): FabricObject | null;

  handleScaled(shouldRenderCanvas?: boolean): void;

  recompute(): void;
}
