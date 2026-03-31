import { createObjectFitClass } from "./create-object-fit-class";
import type { IFabricNS } from "./types/i-fabric-ns";
import type { ISetupOptions } from "./types/i-setup-options";

export const setup = (ns: IFabricNS, options: ISetupOptions = {}) => {
  const { assignClassesToRegistry = true } = options;

  const ObjectFit = createObjectFitClass(ns);

  if (assignClassesToRegistry) {
    ns.classRegistry.setClass(ObjectFit);
  }

  return { ObjectFit };
};
