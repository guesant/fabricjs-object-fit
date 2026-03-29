import { Tag } from "../../enums/Tag";
import { fromTag } from "../../Point";
import { defaultPosition } from "./defaultPosition";
import { parsePosition } from "./parsePosition";

describe(parsePosition.name, () => {
  it("should parse both x and y", () => {
    const position = parsePosition({
      x: { type: "fromAbsolute", args: [10] },
      y: { type: "fromTag", args: [Tag.CENTER] },
    });

    expect(position.x.getAbsolute(100, 50)).toBe(10);
    expect(position.y.getAbsolute(100, 50)).toBe(
      fromTag(Tag.CENTER).getAbsolute(100, 50),
    );
  });

  it("should fall back to default x when x is missing", () => {
    const position = parsePosition({
      y: { type: "fromAbsolute", args: [20] },
    } as any);

    expect(position.x.getAbsolute(100, 50)).toBe(
      defaultPosition.x.getAbsolute(100, 50),
    );
    expect(position.y.getAbsolute(100, 50)).toBe(20);
  });

  it("should fall back to default y when y is missing", () => {
    const position = parsePosition({
      x: { type: "fromAbsolute", args: [15] },
    } as any);

    expect(position.x.getAbsolute(100, 50)).toBe(15);
    expect(position.y.getAbsolute(100, 50)).toBe(
      defaultPosition.y.getAbsolute(100, 50),
    );
  });

  it("should return defaults for empty object", () => {
    const position = parsePosition({} as any);

    expect(position.x.getAbsolute(100, 50)).toBe(
      defaultPosition.x.getAbsolute(100, 50),
    );
    expect(position.y.getAbsolute(100, 50)).toBe(
      defaultPosition.y.getAbsolute(100, 50),
    );
  });

  it("should handle null x/y values", () => {
    const position = parsePosition({
      x: null,
      y: null,
    } as any);

    expect(position.x.getAbsolute(100, 50)).toBe(
      defaultPosition.x.getAbsolute(100, 50),
    );
    expect(position.y.getAbsolute(100, 50)).toBe(
      defaultPosition.y.getAbsolute(100, 50),
    );
  });
});
