import type { IFitMode } from "@guesant/object-fit.core";
import type { IGetFittedObjectPayload } from "./i-get-fitted-object-payload";

export type IGetFittedObjectOptions = IGetFittedObjectPayload & {
  mode: IFitMode;
};
