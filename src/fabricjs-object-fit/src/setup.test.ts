import * as fabric from "fabric";
import { setup } from "./setup";

describe(setup.name, () => {
  it("should return an object with ObjectFit constructor", () => {
    const result = setup(fabric);
    expect(result.ObjectFit).toBeDefined();
    expect(typeof result.ObjectFit).toBe("function");
  });

  it("should assign ObjectFit to namespace by default", () => {
    const ns = { ...fabric } as Record<string, unknown> & typeof fabric;
    setup(ns);
    expect(ns.ObjectFit).toBeDefined();
  });

  it("should not assign to namespace when assingClassesToNamespace=false", () => {
    const { ObjectFit: _, ...rest } = fabric as Record<string, unknown>;
    const ns = rest as unknown as typeof fabric;
    setup(ns, { assingClassesToNamespace: false });
    expect((ns as Record<string, unknown>).ObjectFit).toBeUndefined();
  });

  it("returned ObjectFit should be functional", () => {
    const { ObjectFit } = setup(fabric);
    const of = new ObjectFit(null, { width: 100, height: 100 });
    expect(of.width).toBe(100);
    expect(of.height).toBe(100);
  });
});
