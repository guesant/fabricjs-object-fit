import { IObjectFit } from "../types/IObjectFit";
import { IGetFittedObjectOptions } from "./IGetFittedObjectOptions";

export type IObjectFitConstructorOptions = Partial<
  IGetFittedObjectOptions &
    Pick<
      IObjectFit,
      | "useObjectTransform"
      | "enableRecomputeOnScaled"
      | "enableRecomputeOnScaling"
    >
>;
