import { IObjectFit } from "..";
import { IGetFittedObjectOptions } from "./IGetFittedObjectOptions";

export type IObjectFitConstructorOptions = IGetFittedObjectOptions &
  Partial<
    Pick<
      IObjectFit,
      | "useObjectTransform"
      | "enableRecomputeOnScaled"
      | "enableRecomputeOnScaling"
    >
  >;
