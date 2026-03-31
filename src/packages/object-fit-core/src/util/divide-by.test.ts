import { divideBy } from "./divide-by";

describe(divideBy.name, () => {
  it("should divide normally", () => {
    expect(divideBy(10, 2)).toBe(5);
    expect(divideBy(100, 4)).toBe(25);
  });

  it("should throw on divide by zero", () => {
    expect(() => divideBy(10, 0)).toThrow();
    expect(() => divideBy(-10, 0)).toThrow();
    expect(() => divideBy(0, 0)).toThrow();
  });

  it("should handle zero divided by number", () => {
    expect(divideBy(0, 5)).toBe(0);
  });

  it("should handle negative numbers", () => {
    expect(divideBy(-10, 2)).toBe(-5);
    expect(divideBy(10, -2)).toBe(-5);
    expect(divideBy(-10, -2)).toBe(5);
  });

  it("should handle fractional results", () => {
    expect(divideBy(1, 3)).toBeCloseTo(0.3333, 4);
  });
});
