import type { FabricObject } from "fabric";
import type { IObjectFit } from "./i-object-fit";
import type { IObjectFitConstructorOptions } from "./i-object-fit-constructor-options";
import type { IObjectFitSerialized } from "./i-object-fit-serialized";

export interface IObjectFitConstructor {
  type: string;

  new (
    object?: FabricObject | null | undefined,
    options?: IObjectFitConstructorOptions,
  ): IObjectFit;

  fromObject(objectSerialized: IObjectFitSerialized): Promise<IObjectFit>;
}
