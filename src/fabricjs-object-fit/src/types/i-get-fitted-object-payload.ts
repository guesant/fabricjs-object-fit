import type { IPosition } from "./i-position";

export type IGetFittedObjectPayload = {
  width: number;
  height: number;

  position?: Partial<IPosition>;
};
