import * as fabric from "fabric";
import { fabricObjectDefaults } from "./fabric-object-defaults";
import { getObjectCoordsAndReset } from "./get-object-coords-and-reset";

describe(getObjectCoordsAndReset.name, () => {
  it("should extract left and top", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      left: 10,
      top: 20,
      width: 50,
      height: 50,
    });

    const coords = getObjectCoordsAndReset(obj);

    expect(coords.left).toBe(10);
    expect(coords.top).toBe(20);
  });

  it("should reset object position to 0,0", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      left: 10,
      top: 20,
      width: 50,
      height: 50,
    });

    getObjectCoordsAndReset(obj);

    expect(obj.left).toBe(0);
    expect(obj.top).toBe(0);
  });

  it("should reset origin to left/top", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      left: 5,
      top: 5,
      width: 50,
      height: 50,
      originX: "center",
      originY: "center",
    } as fabric.RectProps);

    getObjectCoordsAndReset(obj);

    expect(obj.originX).toBe("left");
    expect(obj.originY).toBe("top");
  });

  it("should default to 0 when left/top are undefined", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      width: 50,
      height: 50,
    });
    delete (obj as Partial<fabric.Rect>).left;
    delete (obj as Partial<fabric.Rect>).top;

    const coords = getObjectCoordsAndReset(obj);

    expect(coords.left).toBe(0);
    expect(coords.top).toBe(0);
  });
});
