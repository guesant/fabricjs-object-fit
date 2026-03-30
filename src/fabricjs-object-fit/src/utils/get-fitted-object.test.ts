import * as fabric from "fabric";
import { FitMode } from "../enums/fit-mode";
import { divideBy } from "../misc/divide-by";
import { getFakeObject } from "../misc/fabric/get-fake-object";
import { fromAbsolute } from "../point/index.js";
import type { IFitMode } from "../types/i-fit-mode";
import { getFittedObject } from "./get-fitted-object";

describe(getFittedObject.name, () => {
  const OBJECT = { top: 10, left: 5, width: 200, height: 100 };
  const CONTAINER = { width: 100, height: 80 };
  const POSITION = {
    x: fromAbsolute(0),
    y: fromAbsolute(0),
  };

  const callWithMode = (mode: IFitMode) => {
    const obj = getFakeObject({ ...OBJECT }, fabric);
    const result = getFittedObject(
      obj,
      { mode, ...CONTAINER, position: POSITION },
      fabric,
    );
    return { obj, result };
  };

  it("routes to FILL mode correctly", () => {
    const { obj } = callWithMode(FitMode.FILL);
    expect(obj.scaleX ?? 0).toBeCloseTo(
      divideBy(CONTAINER.width, OBJECT.width),
    );
    expect(obj.scaleY ?? 0).toBeCloseTo(
      divideBy(CONTAINER.height, OBJECT.height),
    );
  });

  it("routes to CONTAIN mode correctly", () => {
    const { obj } = callWithMode(FitMode.CONTAIN);
    const scale = Math.min(
      divideBy(CONTAINER.width, OBJECT.width),
      divideBy(CONTAINER.height, OBJECT.height),
    );
    expect(obj.scaleX ?? 0).toBeCloseTo(scale);
    expect(obj.scaleY ?? 0).toBeCloseTo(scale);
  });

  it("routes to COVER mode correctly", () => {
    const { obj } = callWithMode(FitMode.COVER);
    const scale = Math.max(
      divideBy(CONTAINER.width, OBJECT.width),
      divideBy(CONTAINER.height, OBJECT.height),
    );
    expect(obj.scaleX ?? 0).toBeCloseTo(scale);
    expect(obj.scaleY ?? 0).toBeCloseTo(scale);
  });

  it("routes to NONE mode correctly", () => {
    const { obj } = callWithMode(FitMode.NONE);
    expect(obj.scaleX ?? 0).toBe(1);
    expect(obj.scaleY ?? 0).toBe(1);
  });

  it("routes to SCALE_DOWN mode correctly", () => {
    // object is larger → should behave like contain
    const { obj } = callWithMode(FitMode.SCALE_DOWN);
    const scale = Math.min(
      divideBy(CONTAINER.width, OBJECT.width),
      divideBy(CONTAINER.height, OBJECT.height),
    );
    expect(obj.scaleX ?? 0).toBeCloseTo(scale);
    expect(obj.scaleY ?? 0).toBeCloseTo(scale);
  });

  it("throws on unknown mode", () => {
    const obj = getFakeObject({ ...OBJECT }, fabric);
    expect(() =>
      getFittedObject(
        obj,
        {
          mode: "banana" as unknown as IFitMode,
          ...CONTAINER,
          position: POSITION,
        },
        fabric,
      ),
    ).toThrow('The fit mode "banana" are not implemented.');
  });
});
