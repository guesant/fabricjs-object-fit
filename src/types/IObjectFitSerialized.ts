import { fabric } from "fabric";
import { IPositionSerialized } from "./IPositionSerialized";
import { IFitMode } from "../types/IFitMode";

export type IObjectFitSerialized = Partial<fabric.Group> & {
  width: number;
  height: number;
  mode: IFitMode;
  position: IPositionSerialized;
  object: Partial<fabric.Object>;
};
