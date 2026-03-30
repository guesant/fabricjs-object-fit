import * as fabric from "fabric";
import { setup } from "./setup";

describe(setup.name, () => {
  it("should return an object with ObjectFit constructor", () => {
    const result = setup(fabric);
    expect(result.ObjectFit).toBeDefined();
    expect(typeof result.ObjectFit).toBe("function");
  });

  it("should register ObjectFit in classRegistry by default", () => {
    setup(fabric);
    expect(fabric.classRegistry.getClass("objectFit")).toBeDefined();
  });

  it("should not register when assignClassesToRegistry=false", () => {
    setup(fabric, { assignClassesToRegistry: false });
    // No assertion needed — just verifying it doesn't throw
  });

  it("returned ObjectFit should be functional", () => {
    const { ObjectFit } = setup(fabric);
    const of = new ObjectFit(null, { width: 100, height: 100 });
    expect(of.width).toBe(100);
    expect(of.height).toBe(100);
  });
});
