import { createObjectFitClass } from "./createObjectFitClass";
import type { IFabricNS } from "./types/IFabricNS";
import type { ISetupOptions } from "./types/ISetupOptions";

export const setup = (ns: IFabricNS, options: ISetupOptions = {}) => {
  const { assingClassesToNamespace = true } = options;

  const ObjectFit = createObjectFitClass(ns);

  if (assingClassesToNamespace && Object.isExtensible(ns)) {
    Object.assign(ns, { ObjectFit });
  }

  return { ObjectFit };
};
