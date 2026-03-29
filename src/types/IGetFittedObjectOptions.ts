import type { IFitMode } from "./IFitMode";
import type { IGetFittedObjectPayload } from "./IGetFittedObjectPayload";

export type IGetFittedObjectOptions = IGetFittedObjectPayload & {
  mode: IFitMode;
};
