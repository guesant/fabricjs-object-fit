import type { SerializedGroupProps, SerializedObjectProps } from "fabric";
import type { IFitMode } from "./i-fit-mode";
import type { IPositionSerialized } from "./i-position-serialized";

export type IObjectFitSerialized = Partial<SerializedGroupProps> & {
  width: number;
  height: number;
  mode: IFitMode;
  position: IPositionSerialized;
  object?: Partial<SerializedObjectProps> | null | undefined;
};
