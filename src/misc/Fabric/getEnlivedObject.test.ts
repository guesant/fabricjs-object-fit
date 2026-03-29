import { fabric } from "fabric";
import { getEnlivedObject } from "./getEnlivedObject";

describe(getEnlivedObject.name, () => {
  it("should enlive a serialized object", (done) => {
    const serialized = new fabric.Rect({ width: 100, height: 50 }).toObject();

    getEnlivedObject(
      serialized,
      (enlivedObject) => {
        expect(enlivedObject).not.toBeNull();
        expect(enlivedObject!.type).toBe("rect");
        expect(enlivedObject!.width).toBe(100);
        expect(enlivedObject!.height).toBe(50);
        done();
      },
      fabric
    );
  });

  it("should call callback with null for null input", (done) => {
    getEnlivedObject(
      null,
      (enlivedObject) => {
        expect(enlivedObject).toBeNull();
        done();
      },
      fabric
    );
  });

  it("should call callback with null for undefined input", (done) => {
    getEnlivedObject(
      undefined,
      (enlivedObject) => {
        expect(enlivedObject).toBeNull();
        done();
      },
      fabric
    );
  });
});
