import type { IFitMode, IPositionSerialized } from "@guesant/object-fit.core";
import type { SerializedGroupProps, SerializedObjectProps } from "fabric";

export type IObjectFitSerialized = Partial<SerializedGroupProps> & {
  width: number;
  height: number;
  mode: IFitMode;
  position: IPositionSerialized;
  object?: Partial<SerializedObjectProps> | null | undefined;
};
