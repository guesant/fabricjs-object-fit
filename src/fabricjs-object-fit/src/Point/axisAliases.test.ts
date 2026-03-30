import { Tag } from "../enums/Tag";
import { X, Y } from "./axisAliases";
import { fromTag } from "./fromTag";

describe("axis aliases", () => {
  describe("X aliases", () => {
    it("X.LEFT should equal fromTag(Tag.START)", () => {
      expect(X.LEFT.getAbsolute(100, 50)).toBe(
        fromTag(Tag.START).getAbsolute(100, 50),
      );
    });

    it("X.CENTER should equal fromTag(Tag.CENTER)", () => {
      expect(X.CENTER.getAbsolute(100, 50)).toBe(
        fromTag(Tag.CENTER).getAbsolute(100, 50),
      );
    });

    it("X.RIGHT should equal fromTag(Tag.END)", () => {
      expect(X.RIGHT.getAbsolute(100, 50)).toBe(
        fromTag(Tag.END).getAbsolute(100, 50),
      );
    });

    it("X.LEFT.toString!() should return Point.X.LEFT", () => {
      expect(X.LEFT.toString?.()).toBe("Point.X.LEFT");
    });

    it("X.CENTER.toString!() should return Point.X.CENTER", () => {
      expect(X.CENTER.toString?.()).toBe("Point.X.CENTER");
    });

    it("X.RIGHT.toString!() should return Point.X.RIGHT", () => {
      expect(X.RIGHT.toString?.()).toBe("Point.X.RIGHT");
    });
  });

  describe("Y aliases", () => {
    it("Y.TOP should equal fromTag(Tag.START)", () => {
      expect(Y.TOP.getAbsolute(100, 50)).toBe(
        fromTag(Tag.START).getAbsolute(100, 50),
      );
    });

    it("Y.CENTER should equal fromTag(Tag.CENTER)", () => {
      expect(Y.CENTER.getAbsolute(100, 50)).toBe(
        fromTag(Tag.CENTER).getAbsolute(100, 50),
      );
    });

    it("Y.BOTTOM should equal fromTag(Tag.END)", () => {
      expect(Y.BOTTOM.getAbsolute(100, 50)).toBe(
        fromTag(Tag.END).getAbsolute(100, 50),
      );
    });

    it("Y.TOP.toString!() should return Point.Y.TOP", () => {
      expect(Y.TOP.toString?.()).toBe("Point.Y.TOP");
    });

    it("Y.CENTER.toString!() should return Point.Y.CENTER", () => {
      expect(Y.CENTER.toString?.()).toBe("Point.Y.CENTER");
    });

    it("Y.BOTTOM.toString!() should return Point.Y.BOTTOM", () => {
      expect(Y.BOTTOM.toString?.()).toBe("Point.Y.BOTTOM");
    });
  });

  describe("getAbsolute values", () => {
    it("X.LEFT should return 0 (start of container)", () => {
      expect(X.LEFT.getAbsolute(200, 100)).toBe(0);
    });

    it("X.CENTER should center the object", () => {
      // (200 - 100) * 0.5 = 50
      expect(X.CENTER.getAbsolute(200, 100)).toBe(50);
    });

    it("X.RIGHT should align to end", () => {
      // (200 - 100) * 1 = 100
      expect(X.RIGHT.getAbsolute(200, 100)).toBe(100);
    });

    it("should handle object larger than container", () => {
      // (100 - 200) * 0.5 = -50
      expect(X.CENTER.getAbsolute(100, 200)).toBe(-50);
    });
  });
});
