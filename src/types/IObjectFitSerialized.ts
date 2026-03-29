import type { fabric } from "fabric";
import type { IFitMode } from "../types/IFitMode";
import type { IPositionSerialized } from "./IPositionSerialized";

export type IObjectFitSerialized = Partial<fabric.Group> & {
  width: number;
  height: number;
  mode: IFitMode;
  position: IPositionSerialized;
  object?: Partial<fabric.Object> | null | undefined;
};
