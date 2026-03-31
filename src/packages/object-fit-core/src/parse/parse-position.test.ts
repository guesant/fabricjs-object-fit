import { Tag } from "../enums/tag";
import { fromTag } from "../point/from-tag";
import { defaultPosition } from "./default-position";
import { parsePosition } from "./parse-position";

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
    });

    expect(position.x.getAbsolute(100, 50)).toBe(
      defaultPosition.x.getAbsolute(100, 50),
    );
    expect(position.y.getAbsolute(100, 50)).toBe(20);
  });

  it("should fall back to default y when y is missing", () => {
    const position = parsePosition({
      x: { type: "fromAbsolute", args: [15] },
    });

    expect(position.x.getAbsolute(100, 50)).toBe(15);
    expect(position.y.getAbsolute(100, 50)).toBe(
      defaultPosition.y.getAbsolute(100, 50),
    );
  });

  it("should return defaults for empty object", () => {
    const position = parsePosition({});

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
    } as unknown as Parameters<typeof parsePosition>[0]);

    expect(position.x.getAbsolute(100, 50)).toBe(
      defaultPosition.x.getAbsolute(100, 50),
    );
    expect(position.y.getAbsolute(100, 50)).toBe(
      defaultPosition.y.getAbsolute(100, 50),
    );
  });
});
