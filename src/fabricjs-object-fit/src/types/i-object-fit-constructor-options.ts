import type { IObjectFit } from "./i-object-fit";
import type { IGetFittedObjectOptions } from "./i-get-fitted-object-options";

export type IObjectFitConstructorOptions = Partial<
  IGetFittedObjectOptions &
    Pick<
      IObjectFit,
      | "useObjectTransform"
      | "enableRecomputeOnScaled"
      | "enableRecomputeOnScaling"
    >
>;
