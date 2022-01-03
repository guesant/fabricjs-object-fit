import { IObjectFitConstructor } from "./IObjectFitConstructor";

declare module "fabric" {
  namespace fabric {
    interface ObjectFit extends IObjectFitConstructor {}
    class ObjectFit {}
  }
}

export {};
