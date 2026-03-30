import { createObjectFitClass } from "./createObjectFitClass";
import type { IFabricNS } from "./types/IFabricNS";
import type { ISetupOptions } from "./types/ISetupOptions";

export const setup = (ns: IFabricNS, options: ISetupOptions = {}) => {
  const { assignClassesToRegistry = true } = options;

  const ObjectFit = createObjectFitClass(ns);

  if (assignClassesToRegistry) {
    ns.classRegistry.setClass(ObjectFit);
  }

  return { ObjectFit };
};
