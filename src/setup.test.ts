import { fabric } from "fabric";
import { setup } from "./setup";

describe(setup.name, () => {
  it("should return an object with ObjectFit constructor", () => {
    const result = setup(fabric);
    expect(result.ObjectFit).toBeDefined();
    expect(typeof result.ObjectFit).toBe("function");
  });

  it("should assign ObjectFit to namespace by default", () => {
    const ns = { ...fabric } as any;
    setup(ns);
    expect(ns.ObjectFit).toBeDefined();
  });

  it("should not assign to namespace when assingClassesToNamespace=false", () => {
    const ns = { ...fabric } as any;
    delete ns.ObjectFit;
    setup(ns, { assingClassesToNamespace: false });
    expect(ns.ObjectFit).toBeUndefined();
  });

  it("returned ObjectFit should be functional", () => {
    const { ObjectFit } = setup(fabric);
    const of = new ObjectFit(null, { width: 100, height: 100 });
    expect(of.width).toBe(100);
    expect(of.height).toBe(100);
  });
});
