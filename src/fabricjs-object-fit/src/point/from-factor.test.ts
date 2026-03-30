import { fromFactor } from "./from-factor";

describe(fromFactor.name, () => {
  it("object < container", () => {
    const objectSize = 50;
    const containerSize = 100;

    expect(fromFactor(0).getAbsolute(containerSize, objectSize)).toBe(0);
    expect(fromFactor(0.25).getAbsolute(containerSize, objectSize)).toBe(12.5);
    expect(fromFactor(0.5).getAbsolute(containerSize, objectSize)).toBe(25);
    expect(fromFactor(0.75).getAbsolute(containerSize, objectSize)).toBe(37.5);
    expect(fromFactor(1).getAbsolute(containerSize, objectSize)).toBe(50);
  });

  it("object > container", () => {
    const objectSize = 100;
    const containerSize = 50;

    expect(fromFactor(0).getAbsolute(containerSize, objectSize)).toBe(-0);
    expect(fromFactor(0.25).getAbsolute(containerSize, objectSize)).toBe(-12.5);
    expect(fromFactor(0.5).getAbsolute(containerSize, objectSize)).toBe(-25);
    expect(fromFactor(0.75).getAbsolute(containerSize, objectSize)).toBe(-37.5);
    expect(fromFactor(1).getAbsolute(containerSize, objectSize)).toBe(-50);
  });

  it("equal sizes should return 0", () => {
    expect(fromFactor(0.5).getAbsolute(100, 100)).toBe(0);
    expect(fromFactor(1).getAbsolute(100, 100)).toBe(0);
  });

  it("toJSON should return correct serialization", () => {
    expect(fromFactor(0.5).toJSON()).toEqual({
      type: "fromFactor",
      args: [0.5],
    });
  });

  it("toString should return readable representation", () => {
    expect(fromFactor(0.5).toString?.()).toBe("Point.fromFactor(0.5)");
    expect(fromFactor(0).toString?.()).toBe("Point.fromFactor(0)");
  });
});
