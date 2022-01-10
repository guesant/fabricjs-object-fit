import { fabric } from "fabric";
import { IObjectFitConstructorOptions } from "./IObjectFitConstructorOptions";
import { IObjectFit } from "./IObjectFit";
import { IObjectFitSerialized } from "./IObjectFitSerialized";

export interface IObjectFitConstructor {
  new (
    object?: fabric.Object | null | undefined,
    options?: IObjectFitConstructorOptions
  ): IObjectFit;

  fromObject(
    objectSerialized: IObjectFitSerialized,
    callback?: (object: IObjectFit) => void
  ): void;
}
