import type { IObjectFit } from "../types/IObjectFit";
import type { IGetFittedObjectOptions } from "./IGetFittedObjectOptions";

export type IObjectFitConstructorOptions = Partial<
  IGetFittedObjectOptions &
    Pick<
      IObjectFit,
      | "useObjectTransform"
      | "enableRecomputeOnScaled"
      | "enableRecomputeOnScaling"
    >
>;
