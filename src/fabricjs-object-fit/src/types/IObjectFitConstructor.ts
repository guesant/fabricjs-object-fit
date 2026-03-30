import type { FabricObject } from "fabric";
import type { IObjectFit } from "./IObjectFit";
import type { IObjectFitConstructorOptions } from "./IObjectFitConstructorOptions";
import type { IObjectFitSerialized } from "./IObjectFitSerialized";

export interface IObjectFitConstructor {
  type: string;

  new (
    object?: FabricObject | null | undefined,
    options?: IObjectFitConstructorOptions,
  ): IObjectFit;

  fromObject(objectSerialized: IObjectFitSerialized): Promise<IObjectFit>;
}
