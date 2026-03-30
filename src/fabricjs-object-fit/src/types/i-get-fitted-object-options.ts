import type { IFitMode } from "./i-fit-mode";
import type { IGetFittedObjectPayload } from "./i-get-fitted-object-payload";

export type IGetFittedObjectOptions = IGetFittedObjectPayload & {
  mode: IFitMode;
};
