import type { IPosition } from "@guesant/object-fit.core";

export type IGetFittedObjectPayload = {
  width: number;
  height: number;

  position?: Partial<IPosition>;
};
