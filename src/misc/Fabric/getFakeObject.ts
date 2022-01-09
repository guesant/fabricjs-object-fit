import { fabric } from "fabric";
import { IFabricNS } from "../../types/IFabricNS";
import { fabricObjectDefaults } from "./fabricObjectDefaults";

// this function will only be called in test files

export const getFakeObject = (
  options: Partial<fabric.IObjectOptions>,
  ns: IFabricNS
) => new ns.Rect({ ...fabricObjectDefaults, ...options });
