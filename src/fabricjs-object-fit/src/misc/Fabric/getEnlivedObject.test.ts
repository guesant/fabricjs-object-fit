import * as fabric from "fabric";
import { getEnlivedObject } from "./getEnlivedObject";

describe(getEnlivedObject.name, () => {
  it("should enlive a serialized object", async () => {
    const serialized = new fabric.Rect({
      width: 100,
      height: 50,
    }).toObject() as unknown as Record<string, unknown>;

    const enlivedObject = await getEnlivedObject(serialized, fabric);

    expect(enlivedObject).not.toBeNull();
    expect(enlivedObject?.width).toBe(100);
    expect(enlivedObject?.height).toBe(50);
  });

  it("should return null for null input", async () => {
    const enlivedObject = await getEnlivedObject(null, fabric);
    expect(enlivedObject).toBeNull();
  });

  it("should return null for undefined input", async () => {
    const enlivedObject = await getEnlivedObject(undefined, fabric);
    expect(enlivedObject).toBeNull();
  });
});
