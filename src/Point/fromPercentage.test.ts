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
});
