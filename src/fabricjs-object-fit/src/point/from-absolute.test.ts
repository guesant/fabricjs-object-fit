import { fromAbsolute } from "./from-absolute";

describe(fromAbsolute.name, () => {
  it("should return the absolute position regardless of sizes", () => {
    expect(fromAbsolute(30).getAbsolute(50, 50)).toBe(30);
    expect(fromAbsolute(20).getAbsolute(50, 100)).toBe(20);
    expect(fromAbsolute(10).getAbsolute(100, 50)).toBe(10);
  });

  it("should handle zero position", () => {
    expect(fromAbsolute(0).getAbsolute(100, 50)).toBe(0);
  });

  it("should handle negative position", () => {
    expect(fromAbsolute(-10).getAbsolute(100, 50)).toBe(-10);
  });

  it("toJSON should return correct serialization", () => {
    expect(fromAbsolute(10).toJSON()).toEqual({
      type: "fromAbsolute",
      args: [10],
    });
    expect(fromAbsolute(0).toJSON()).toEqual({
      type: "fromAbsolute",
      args: [0],
    });
  });

  it("toString should return readable representation", () => {
    expect(fromAbsolute(10).toString?.()).toBe("Point.fromAbsolute(10)");
    expect(fromAbsolute(0).toString?.()).toBe("Point.fromAbsolute(0)");
  });
});
