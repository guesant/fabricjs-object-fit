import { divideBy } from "./divideBy";

describe(divideBy.name, () => {
  it("should divide normally", () => {
    expect(divideBy(10, 2)).toBe(5);
    expect(divideBy(100, 4)).toBe(25);
  });

  it("should handle divide by zero (Infinity)", () => {
    expect(divideBy(10, 0)).toBe(Infinity);
    expect(divideBy(-10, 0)).toBe(-Infinity);
  });

  it("should handle zero divided by number", () => {
    expect(divideBy(0, 5)).toBe(0);
  });

  it("should handle zero divided by zero (NaN)", () => {
    expect(divideBy(0, 0)).toBeNaN();
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
