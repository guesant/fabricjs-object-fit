import { fromPercentage } from "./fromPercentage";

describe(fromPercentage.name, () => {
  it("should accept number", () => {
    expect(fromPercentage(0).getAbsolute(100, 50)).toBe(0);
    expect(fromPercentage(50).getAbsolute(100, 50)).toBe(25);
    expect(fromPercentage(100).getAbsolute(100, 50)).toBe(50);

    expect(fromPercentage(0).getAbsolute(50, 100)).toBe(-0);
    expect(fromPercentage(50).getAbsolute(50, 100)).toBe(-25);
    expect(fromPercentage(100).getAbsolute(50, 100)).toBe(-50);
  });

  it("should accept string", () => {
    expect(fromPercentage("0").getAbsolute(100, 50)).toBe(0);
    expect(fromPercentage("50").getAbsolute(100, 50)).toBe(25);
    expect(fromPercentage("100").getAbsolute(100, 50)).toBe(50);

    expect(fromPercentage("0").getAbsolute(50, 100)).toBe(-0);
    expect(fromPercentage("50").getAbsolute(50, 100)).toBe(-25);
    expect(fromPercentage("100").getAbsolute(50, 100)).toBe(-50);
  });

  it("should accept string that ends with %", () => {
    expect(fromPercentage("0%").getAbsolute(100, 50)).toBe(0);
    expect(fromPercentage("50%").getAbsolute(100, 50)).toBe(25);
    expect(fromPercentage("100%").getAbsolute(100, 50)).toBe(50);

    expect(fromPercentage("0%").getAbsolute(50, 100)).toBe(-0);
    expect(fromPercentage("50%").getAbsolute(50, 100)).toBe(-25);
    expect(fromPercentage("100%").getAbsolute(50, 100)).toBe(-50);
  });

  it("toJSON should preserve original input type", () => {
    expect(fromPercentage(50).toJSON()).toEqual({
      type: "fromPercentage",
      args: [50]
    });
    expect(fromPercentage("50%").toJSON()).toEqual({
      type: "fromPercentage",
      args: ["50%"]
    });
    expect(fromPercentage("75").toJSON()).toEqual({
      type: "fromPercentage",
      args: ["75"]
    });
  });

  it("toString should return readable representation", () => {
    expect(fromPercentage(50).toString!()).toBe("Point.fromPercentage(50)");
    expect(fromPercentage("50%").toString!()).toBe("Point.fromPercentage(50%)");
  });

  it("25% should produce factor 0.25 behavior", () => {
    // (100 - 50) * 0.25 = 12.5
    expect(fromPercentage(25).getAbsolute(100, 50)).toBe(12.5);
    expect(fromPercentage("25%").getAbsolute(100, 50)).toBe(12.5);
  });
});
