import { fabric } from "fabric";
import { getEnlivedObject } from "./getEnlivedObject";

describe(getEnlivedObject.name, () => {
  it("should enlive a serialized object", () => {
    const serialized = new fabric.Rect({ width: 100, height: 50 }).toObject();

    return new Promise<void>((resolve) => {
      getEnlivedObject(
        serialized,
        (enlivedObject) => {
          expect(enlivedObject).not.toBeNull();
          expect(enlivedObject?.type).toBe("rect");
          expect(enlivedObject?.width).toBe(100);
          expect(enlivedObject?.height).toBe(50);
          resolve();
        },
        fabric,
      );
    });
  });

  it("should call callback with null for null input", () => {
    return new Promise<void>((resolve) => {
      getEnlivedObject(
        null,
        (enlivedObject) => {
          expect(enlivedObject).toBeNull();
          resolve();
        },
        fabric,
      );
    });
  });

  it("should call callback with null for undefined input", () => {
    return new Promise<void>((resolve) => {
      getEnlivedObject(
        undefined,
        (enlivedObject) => {
          expect(enlivedObject).toBeNull();
          resolve();
        },
        fabric,
      );
    });
  });
});
