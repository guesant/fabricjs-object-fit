import { createObjectFitClass } from "./createObjectFitClass";
import { ISetupOptions } from "./types/ISetupOptions";
import { IFabricNS } from "./types/IFabricNS";

export const setup = (ns: IFabricNS, options: ISetupOptions = {}) => {
  const { assingClassesToNamespace = true } = options;

  const ObjectFit = createObjectFitClass(ns);

  if (assingClassesToNamespace) {
    Object.assign(ns, { ObjectFit });
  }

  return { ObjectFit };
};
