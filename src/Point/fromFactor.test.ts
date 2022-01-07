import { fromFactor } from "./fromFactor";

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
});
