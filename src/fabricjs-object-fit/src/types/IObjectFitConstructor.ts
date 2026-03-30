import type { fabric } from "fabric";
import type { IObjectFit } from "./IObjectFit";
import type { IObjectFitConstructorOptions } from "./IObjectFitConstructorOptions";
import type { IObjectFitSerialized } from "./IObjectFitSerialized";

export interface IObjectFitConstructor {
  new (
    object?: fabric.Object | null | undefined,
    options?: IObjectFitConstructorOptions,
  ): IObjectFit;

  fromObject(
    objectSerialized: IObjectFitSerialized,
    callback?: (object: IObjectFit) => void,
  ): void;
}
