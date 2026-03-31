import { Tag } from "../enums/tag";
import { fromTag } from "./from-tag";

describe(fromTag.name, () => {
  it("should compute correct positions", () => {
    expect(fromTag(Tag.START).getAbsolute(50, 100)).toBe(-0);
    expect(fromTag(Tag.START).getAbsolute(100, 50)).toBe(0);

    expect(fromTag(Tag.CENTER).getAbsolute(50, 100)).toBe(-25);
    expect(fromTag(Tag.CENTER).getAbsolute(100, 50)).toBe(25);

    expect(fromTag(Tag.END).getAbsolute(50, 100)).toBe(-50);
    expect(fromTag(Tag.END).getAbsolute(100, 50)).toBe(50);
  });

  it("toJSON should return tag value", () => {
    expect(fromTag(Tag.START).toJSON()).toEqual({
      type: "fromTag",
      args: [Tag.START],
    });
    expect(fromTag(Tag.CENTER).toJSON()).toEqual({
      type: "fromTag",
      args: [Tag.CENTER],
    });
    expect(fromTag(Tag.END).toJSON()).toEqual({
      type: "fromTag",
      args: [Tag.END],
    });
  });

  it("toString should include tag name", () => {
    expect(fromTag(Tag.START).toString?.()).toBe("Point.fromTag(Tag.START)");
    expect(fromTag(Tag.CENTER).toString?.()).toBe("Point.fromTag(Tag.CENTER)");
    expect(fromTag(Tag.END).toString?.()).toBe("Point.fromTag(Tag.END)");
  });

  it("equal sizes should return 0 for all tags", () => {
    expect(fromTag(Tag.START).getAbsolute(100, 100)).toBe(0);
    expect(fromTag(Tag.CENTER).getAbsolute(100, 100)).toBe(0);
    expect(fromTag(Tag.END).getAbsolute(100, 100)).toBe(0);
  });
});
