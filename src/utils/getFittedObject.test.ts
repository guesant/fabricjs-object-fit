import { fabric } from "fabric";
import { FitMode } from "../enums/FitMode";
import { divideBy } from "../misc/divideBy";
import { getFakeObject } from "../misc/Fabric/getFakeObject";
import { fromAbsolute } from "../Point";
import { getFittedObject } from "./getFittedObject";

describe(getFittedObject.name, () => {
  const OBJECT = { top: 10, left: 5, width: 200, height: 100 };
  const CONTAINER = { width: 100, height: 80 };
  const POSITION = {
    x: fromAbsolute(0),
    y: fromAbsolute(0)
  };

  const callWithMode = (mode: string) => {
    const obj = getFakeObject({ ...OBJECT }, fabric);
    const result = getFittedObject(
      obj,
      { mode: mode as any, ...CONTAINER, position: POSITION },
      fabric
    );
    return { obj, result };
  };

  it("routes to FILL mode correctly", () => {
    const { obj } = callWithMode(FitMode.FILL);
    expect(obj.scaleX!).toBeCloseTo(divideBy(CONTAINER.width, OBJECT.width));
    expect(obj.scaleY!).toBeCloseTo(divideBy(CONTAINER.height, OBJECT.height));
  });

  it("routes to CONTAIN mode correctly", () => {
    const { obj } = callWithMode(FitMode.CONTAIN);
    const scale = Math.min(
      divideBy(CONTAINER.width, OBJECT.width),
      divideBy(CONTAINER.height, OBJECT.height)
    );
    expect(obj.scaleX!).toBeCloseTo(scale);
    expect(obj.scaleY!).toBeCloseTo(scale);
  });

  it("routes to COVER mode correctly", () => {
    const { obj } = callWithMode(FitMode.COVER);
    const scale = Math.max(
      divideBy(CONTAINER.width, OBJECT.width),
      divideBy(CONTAINER.height, OBJECT.height)
    );
    expect(obj.scaleX!).toBeCloseTo(scale);
    expect(obj.scaleY!).toBeCloseTo(scale);
  });

  it("routes to NONE mode correctly", () => {
    const { obj } = callWithMode(FitMode.NONE);
    expect(obj.scaleX!).toBe(1);
    expect(obj.scaleY!).toBe(1);
  });

  it("routes to SCALE_DOWN mode correctly", () => {
    // object is larger → should behave like contain
    const { obj } = callWithMode(FitMode.SCALE_DOWN);
    const scale = Math.min(
      divideBy(CONTAINER.width, OBJECT.width),
      divideBy(CONTAINER.height, OBJECT.height)
    );
    expect(obj.scaleX!).toBeCloseTo(scale);
    expect(obj.scaleY!).toBeCloseTo(scale);
  });

  it("throws on unknown mode", () => {
    const obj = getFakeObject({ ...OBJECT }, fabric);
    expect(() =>
      getFittedObject(
        obj,
        { mode: "banana" as any, ...CONTAINER, position: POSITION },
        fabric
      )
    ).toThrow('The fit mode "banana" are not implemented.');
  });
});
