import type { FabricObject } from "fabric";
import type { IFabricNS } from "../../types/i-fabric-ns";

export const getEnlivedObject = async (
  object: Record<string, unknown> | null | undefined,
  ns: IFabricNS,
): Promise<FabricObject | null> => {
  if (object) {
    const [enlivedObject] = await ns.util.enlivenObjects<FabricObject>([
      object,
    ]);
    return enlivedObject;
  }
  return null;
};
