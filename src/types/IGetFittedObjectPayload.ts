import { IPosition } from "../types/IPosition";

export type IGetFittedObjectPayload = {
  width: number;
  height: number;

  position?: Partial<IPosition>;
};
