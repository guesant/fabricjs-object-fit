import type { SerializedGroupProps, SerializedObjectProps } from "fabric";
import type { IFitMode } from "../types/IFitMode";
import type { IPositionSerialized } from "./IPositionSerialized";

export type IObjectFitSerialized = Partial<SerializedGroupProps> & {
  width: number;
  height: number;
  mode: IFitMode;
  position: IPositionSerialized;
  object?: Partial<SerializedObjectProps> | null | undefined;
};
