import { Tag } from "../../enums/Tag";
import { defaultPoint } from "./defaultPoint";
import { parsePoint } from "./parsePoint";

describe(parsePoint.name, () => {
  it("fromAbsolute", () => {
    expect(
      parsePoint({ type: "fromAbsolute", args: [10] }).getAbsolute(100, 50)
    ).toBe(10);
  });

  it("fromFactor", () => {
    expect(
      parsePoint({ type: "fromFactor", args: [0.5] }).getAbsolute(100, 50)
    ).toBe(25);
  });

  it("fromPercentage", () => {
    expect(
      parsePoint({ type: "fromPercentage", args: [50] }).getAbsolute(100, 50)
    ).toBe(25);

    expect(
      parsePoint({ type: "fromPercentage", args: ["50%"] }).getAbsolute(100, 50)
    ).toBe(25);
  });

  it("fromTag", () => {
    expect(
      parsePoint({ type: "fromTag", args: [Tag.START] }).getAbsolute(100, 50)
    ).toBe(0);

    expect(
      parsePoint({ type: "fromTag", args: [Tag.CENTER] }).getAbsolute(100, 50)
    ).toBe(25);

    expect(
      parsePoint({ type: "fromTag", args: [Tag.END] }).getAbsolute(100, 50)
    ).toBe(50);
  });

  it("invalid", () => {
    expect(() =>
      parsePoint(
        { type: "fromModeThatIsNotImplemented", args: [] } as any,
        true
      )
    ).not.toThrow();

    expect(
      parsePoint(
        { type: "fromModeThatIsNotImplemented", args: [] } as any,
        true
      )
    ).toEqual(defaultPoint);

    expect(() =>
      parsePoint(
        { type: "fromModeThatIsNotImplemented", args: [] } as any,
        false
      )
    ).toThrow();
  });
});
