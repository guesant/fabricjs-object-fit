import type { FabricObjectProps } from "fabric";
import type { IFabricNS } from "../../types/IFabricNS";
import { fabricObjectDefaults } from "./fabricObjectDefaults";

// this function will only be called in test files

export const getFakeObject = (
  options: Partial<FabricObjectProps>,
  ns: IFabricNS,
) => new ns.Rect({ ...fabricObjectDefaults, ...options });
