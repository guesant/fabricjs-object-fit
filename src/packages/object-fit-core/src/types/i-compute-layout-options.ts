import type { IFitMode } from "./i-fit-mode";
import type { IPosition } from "./i-position";
import type { ISize } from "./i-size";

export type IComputeLayoutOptions = {
  mode: IFitMode;
  container: ISize;
  object: ISize;
  position?: Partial<IPosition>;
};
