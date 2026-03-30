import type { IGetFittedObjectOptions } from "./i-get-fitted-object-options";
import type { IObjectFit } from "./i-object-fit";

export type IObjectFitConstructorOptions = Partial<
  IGetFittedObjectOptions &
    Pick<
      IObjectFit,
      | "useObjectTransform"
      | "enableRecomputeOnScaled"
      | "enableRecomputeOnScaling"
    >
>;
