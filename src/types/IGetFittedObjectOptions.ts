import { IFitMode } from "./IFitMode";
import { IGetFittedObjectPayload } from "./IGetFittedObjectPayload";

export type IGetFittedObjectOptions = IGetFittedObjectPayload & {
  mode: IFitMode;
};
