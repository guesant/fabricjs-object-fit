import {
  FitMode,
  fromAbsolute,
  fromPercentage,
  fromTag,
  Tag,
} from "@guesant/object-fit.core";
import * as fabric from "fabric";
import { createObjectFitClass } from "./create-object-fit-class";
import { fabricObjectDefaults } from "./misc/fabric/fabric-object-defaults";
import { getFakeObject } from "./misc/fabric/get-fake-object";
import type { IObjectFitSerialized } from "./types/i-object-fit-serialized";

const ObjectFit = createObjectFitClass(fabric);

const makeObject = (width = 200, height = 100) =>
  getFakeObject({ width, height, top: 0, left: 0 }, fabric);

describe("ObjectFit constructor", () => {
  it("should have correct defaults when created without options", () => {
    const of = new ObjectFit(null);

    expect(ObjectFit.type).toBe("objectFit");
    expect(of.mode).toBe(FitMode.FILL);
    expect(Number.isNaN(of.width)).toBe(true);
    expect(Number.isNaN(of.height)).toBe(true);
    expect(of.useObjectTransform).toBe(true);
    expect(of.enableRecomputeOnScaled).toBe(true);
    expect(of.enableRecomputeOnScaling).toBe(false);
    expect(of.object).toBeNull();
  });

  it("should accept custom mode and dimensions", () => {
    const of = new ObjectFit(null, {
      width: 300,
      height: 200,
      mode: FitMode.COVER,
    });

    expect(of.mode).toBe(FitMode.COVER);
    expect(of.width).toBe(300);
    expect(of.height).toBe(200);
  });

  it("should accept custom position", () => {
    const of = new ObjectFit(null, {
      width: 100,
      height: 100,
      position: {
        x: fromAbsolute(10),
        y: fromAbsolute(20),
      },
    });

    expect(of.position.x?.getAbsolute(100, 50)).toBe(10);
    expect(of.position.y?.getAbsolute(100, 50)).toBe(20);
  });

  it("should use default center position when position is omitted", () => {
    const of = new ObjectFit(null, { width: 100, height: 100 });

    // X.CENTER and Y.CENTER use fromTag(Tag.CENTER) which returns (containerSize - objectSize) * 0.5
    expect(of.position.x?.getAbsolute(100, 50)).toBe(25);
    expect(of.position.y?.getAbsolute(100, 50)).toBe(25);
  });

  it("should not crash with undefined object", () => {
    expect(() => new ObjectFit(undefined)).not.toThrow();
  });

  it("should call recompute when created with an object", () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
      mode: FitMode.FILL,
    });

    expect(of.object).toBe(obj);
    // After recompute with FILL mode, the group should have the container dimensions
    expect(of.width).toBe(400);
    expect(of.height).toBe(300);
  });

  it("should adopt object dimensions when width/height are NaN", () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj);

    // NaN width/height should fall back to objectGroup dimensions
    expect(Number.isNaN(of.width)).toBe(false);
    expect(Number.isNaN(of.height)).toBe(false);
    expect(of.width).toBeGreaterThan(0);
    expect(of.height).toBeGreaterThan(0);
  });
});

describe("ObjectFit.setObject", () => {
  it("should set an object", () => {
    const of = new ObjectFit(null, { width: 100, height: 100 });
    const obj = makeObject();

    of.setObject(obj);
    expect(of.object).toBe(obj);
  });

  it("should replace an existing object", () => {
    const obj1 = makeObject(100, 50);
    const obj2 = makeObject(200, 100);
    const of = new ObjectFit(obj1, { width: 300, height: 200 });

    of.setObject(obj2);
    expect(of.object).toBe(obj2);
  });

  it("should set null to clear the object", () => {
    const obj = makeObject();
    const of = new ObjectFit(obj, { width: 100, height: 100 });

    of.setObject(null);
    expect(of.object).toBeNull();
  });

  it("should reset object transform to identity", () => {
    const obj = makeObject();
    obj.set({ scaleX: 2, scaleY: 3, angle: 45 });

    const of = new ObjectFit(null, { width: 100, height: 100 });
    of.setObject(obj);

    // After setObject, the object's transform should be reset
    expect(obj.angle).toBe(0);
  });
});

describe("ObjectFit.detachObject", () => {
  it("should return the previously set object", () => {
    const obj = makeObject();
    const of = new ObjectFit(obj, { width: 100, height: 100 });

    const detached = of.detachObject();
    expect(detached).toBe(obj);
    expect(of.object).toBeNull();
  });

  it("should return null when no object is set", () => {
    const of = new ObjectFit(null, { width: 100, height: 100 });
    const detached = of.detachObject();
    expect(detached).toBeNull();
  });

  it("should not crash when called multiple times", () => {
    const obj = makeObject();
    const of = new ObjectFit(obj, { width: 100, height: 100 });

    of.detachObject();
    expect(() => of.detachObject()).not.toThrow();
  });

  it("should restore original transform when restorePreviousObjectTransform=true", () => {
    const obj = makeObject();
    obj.set({ left: 50, top: 30 });
    obj.setCoords();

    const originalLeft = obj.left;
    const originalTop = obj.top;

    const of = new ObjectFit(null, { width: 100, height: 100 });
    of.setObject(obj, false, true);

    const detached = of.detachObject(true);

    // Transform should be restored to what it was before setObject
    expect(detached?.left).toBe(originalLeft);
    expect(detached?.top).toBe(originalTop);
  });
});

describe("ObjectFit.recompute", () => {
  it("should not crash when no object is set", () => {
    const of = new ObjectFit(null, { width: 100, height: 100 });
    expect(() => of.recompute()).not.toThrow();
  });

  it("should produce a fitted group with valid dimensions and object", () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
      mode: FitMode.FILL,
    });

    // recompute is called during constructor; verify it produced content
    expect(of.getObjects().length).toBeGreaterThan(0);
  });

  it("should fallback to objectGroup width when width is NaN", () => {
    const obj = makeObject(150, 80);
    const of = new ObjectFit(obj, { height: 200 });

    // width was NaN, should have been set from objectGroup
    expect(Number.isNaN(of.width)).toBe(false);
  });

  it("should fallback to objectGroup height when height is NaN", () => {
    const obj = makeObject(150, 80);
    const of = new ObjectFit(obj, { width: 200 });

    // height was NaN, should have been set from objectGroup
    expect(Number.isNaN(of.height)).toBe(false);
  });

  it("should respect mode changes", () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
      mode: FitMode.CONTAIN,
    });

    const widthAfterContain = of.width;

    of.mode = FitMode.COVER;
    of.recompute();

    // Mode changed, recompute was called
    expect(of.mode).toBe(FitMode.COVER);
    // Width should remain the same (container dimensions don't change)
    expect(of.width).toBe(widthAfterContain);
  });
});

describe("ObjectFit.handleScaled", () => {
  it("should absorb scale into dimensions", () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
      mode: FitMode.FILL,
    });

    // Simulate scaling the ObjectFit
    of.set({ scaleX: 2, scaleY: 1.5 });
    of.setCoords();

    of.handleScaled(false);

    expect(of.scaleX).toBe(1);
    expect(of.scaleY).toBe(1);
    // width and height should reflect the scaled dimensions
    expect(of.width).toBeCloseTo(800);
    expect(of.height).toBeCloseTo(450);
  });

  it("should trigger via scaled event when enableRecomputeOnScaled=true", () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
      enableRecomputeOnScaled: true,
    });

    of.set({ scaleX: 2, scaleY: 2 });
    of.setCoords();

    of.fire("modified");

    expect(of.scaleX).toBe(1);
    expect(of.scaleY).toBe(1);
  });

  it("should NOT trigger via scaled event when enableRecomputeOnScaled=false", () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
      enableRecomputeOnScaled: false,
    });

    of.set({ scaleX: 2, scaleY: 2 });
    of.setCoords();

    of.fire("modified");

    // Scale should NOT be absorbed
    expect(of.scaleX).toBe(2);
    expect(of.scaleY).toBe(2);
  });

  it("should trigger via scaling event when enableRecomputeOnScaling=true", () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
      enableRecomputeOnScaling: true,
    });

    of.set({ scaleX: 1.5, scaleY: 1.5 });
    of.setCoords();

    of.fire("scaling");

    expect(of.scaleX).toBe(1);
    expect(of.scaleY).toBe(1);
  });
});

describe("ObjectFit serialization", () => {
  it("toObject should serialize mode, width, height", () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
      mode: FitMode.COVER,
    });

    const serialized = of.toObject() as IObjectFitSerialized;

    expect(serialized.mode).toBe(FitMode.COVER);
    expect(serialized.width).toBe(400);
    expect(serialized.height).toBe(300);
  });

  it("toObject should serialize position", () => {
    const of = new ObjectFit(null, {
      width: 100,
      height: 100,
      position: {
        x: fromAbsolute(10),
        y: fromTag(Tag.END),
      },
    });

    const serialized = of.toObject() as IObjectFitSerialized;

    expect(serialized.position.x).toEqual({ type: "fromAbsolute", args: [10] });
    expect(serialized.position.y).toEqual({ type: "fromTag", args: [Tag.END] });
  });

  it("toObject should serialize the inner object", () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
    });

    const serialized = of.toObject() as IObjectFitSerialized;

    expect(serialized.object).toBeDefined();
    expect((serialized.object as Record<string, unknown>)?.type).toBe("Rect");
  });

  it("toObject should handle no object", () => {
    const of = new ObjectFit(null, {
      width: 100,
      height: 100,
    });

    const serialized = of.toObject() as IObjectFitSerialized;

    expect(serialized.object).toBeUndefined();
  });

  it("fromObject should deserialize", async () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
      mode: FitMode.CONTAIN,
      position: {
        x: fromAbsolute(15),
        y: fromAbsolute(25),
      },
    });

    const serialized = of.toObject() as IObjectFitSerialized;

    const restored = await ObjectFit.fromObject(serialized);
    expect(restored.mode).toBe(FitMode.CONTAIN);
    expect(restored.width).toBe(400);
    expect(restored.height).toBe(300);
    expect(restored.object).not.toBeNull();
  });

  it("fromObject with null object should return ObjectFit with null object", async () => {
    const of = new ObjectFit(null, {
      width: 100,
      height: 100,
      mode: FitMode.NONE,
    });

    const serialized = of.toObject() as IObjectFitSerialized;

    const restored = await ObjectFit.fromObject(serialized);
    expect(restored.object).toBeNull();
    expect(restored.mode).toBe(FitMode.NONE);
  });

  it("round-trip: toObject then fromObject preserves behavior", async () => {
    const obj = makeObject(200, 100);
    const of = new ObjectFit(obj, {
      width: 400,
      height: 300,
      mode: FitMode.COVER,
      position: {
        x: fromPercentage("25%"),
        y: fromTag(Tag.END),
      },
    });

    const serialized = of.toObject() as IObjectFitSerialized;

    const restored = await ObjectFit.fromObject(serialized);
    expect(restored.mode).toBe(of.mode);
    expect(restored.width).toBe(of.width);
    expect(restored.height).toBe(of.height);

    // Position should produce same absolute values
    expect(restored.position.x?.getAbsolute(400, 200)).toBe(
      of.position.x?.getAbsolute(400, 200),
    );
    expect(restored.position.y?.getAbsolute(300, 100)).toBe(
      of.position.y?.getAbsolute(300, 100),
    );
  });
});

describe("useObjectTransform: true (default)", () => {
  describe("origin normalization", () => {
    it("should normalize center/center origin to left/top", () => {
      const obj = new fabric.Rect({
        width: 200,
        height: 100,
        left: 150,
        top: 100,
        originX: "center",
        originY: "center",
        strokeWidth: 0,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 200,
        height: 100,
        mode: FitMode.FILL,
      });

      // center at (150, 100) with 200x100 => left/top at (50, 50)
      expect(of.left).toBeCloseTo(50);
      expect(of.top).toBeCloseTo(50);
      expect(of.originX).toBe("left");
      expect(of.originY).toBe("top");
    });

    it("should normalize right/bottom origin to left/top", () => {
      const obj = new fabric.Rect({
        width: 200,
        height: 100,
        left: 250,
        top: 150,
        originX: "right",
        originY: "bottom",
        strokeWidth: 0,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 200,
        height: 100,
        mode: FitMode.FILL,
      });

      // right at 250 with width 200 => left at 50
      // bottom at 150 with height 100 => top at 50
      expect(of.left).toBeCloseTo(50);
      expect(of.top).toBeCloseTo(50);
    });

    it("should be a no-op when object already uses left/top origin", () => {
      const obj = new fabric.Rect({
        ...fabricObjectDefaults,
        width: 200,
        height: 100,
        left: 50,
        top: 30,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 200,
        height: 100,
        mode: FitMode.FILL,
      });

      expect(of.left).toBeCloseTo(50);
      expect(of.top).toBeCloseTo(30);
    });

    it("should normalize mixed origins (left/bottom)", () => {
      const obj = new fabric.Rect({
        width: 200,
        height: 100,
        left: 50,
        top: 150,
        originX: "left",
        originY: "bottom",
        strokeWidth: 0,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 200,
        height: 100,
        mode: FitMode.FILL,
      });

      expect(of.left).toBeCloseTo(50);
      expect(of.top).toBeCloseTo(50);
    });

    it("should normalize mixed origins (right/top)", () => {
      const obj = new fabric.Rect({
        width: 200,
        height: 100,
        left: 250,
        top: 50,
        originX: "right",
        originY: "top",
        strokeWidth: 0,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 200,
        height: 100,
        mode: FitMode.FILL,
      });

      expect(of.left).toBeCloseTo(50);
      expect(of.top).toBeCloseTo(50);
    });
  });

  describe("with custom transforms", () => {
    it("should preserve object position (left/top origin, no transform)", () => {
      const obj = new fabric.Rect({
        ...fabricObjectDefaults,
        width: 100,
        height: 100,
        left: 80,
        top: 60,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 100,
        height: 100,
        mode: FitMode.COVER,
      });

      expect(of.left).toBeCloseTo(80);
      expect(of.top).toBeCloseTo(60);
    });

    it("should preserve scale from the original object", () => {
      const obj = new fabric.Rect({
        ...fabricObjectDefaults,
        width: 100,
        height: 100,
        left: 0,
        top: 0,
        scaleX: 2,
        scaleY: 3,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 100,
        height: 100,
        mode: FitMode.FILL,
      });

      expect(of.scaleX).toBeCloseTo(2);
      expect(of.scaleY).toBeCloseTo(3);
    });

    it("should preserve angle from the original object", () => {
      const obj = new fabric.Rect({
        ...fabricObjectDefaults,
        width: 100,
        height: 100,
        left: 0,
        top: 0,
        angle: 45,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 100,
        height: 100,
        mode: FitMode.FILL,
      });

      expect(of.angle).toBeCloseTo(45);
    });

    it("should preserve position + scale + angle together", () => {
      const obj = new fabric.Rect({
        ...fabricObjectDefaults,
        width: 100,
        height: 100,
        left: 30,
        top: 40,
        scaleX: 1.5,
        scaleY: 2,
        angle: 90,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 100,
        height: 100,
        mode: FitMode.CONTAIN,
      });

      expect(of.left).toBeCloseTo(30);
      expect(of.top).toBeCloseTo(40);
      expect(of.scaleX).toBeCloseTo(1.5);
      expect(of.scaleY).toBeCloseTo(2);
      expect(of.angle).toBeCloseTo(90);
    });

    it("should normalize center-origin with scale", () => {
      const obj = new fabric.Rect({
        width: 100,
        height: 100,
        left: 100,
        top: 100,
        originX: "center",
        originY: "center",
        scaleX: 2,
        scaleY: 2,
        strokeWidth: 0,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 100,
        height: 100,
        mode: FitMode.FILL,
      });

      // center at (100, 100) with 100x100 scaled 2x => transformed dims 200x200 => left/top at (0, 0)
      expect(of.left).toBeCloseTo(0);
      expect(of.top).toBeCloseTo(0);
      expect(of.scaleX).toBeCloseTo(2);
      expect(of.scaleY).toBeCloseTo(2);
    });
  });

  describe("without custom transforms (identity)", () => {
    it("should place container at origin when object has no transform", () => {
      const obj = new fabric.Rect({
        ...fabricObjectDefaults,
        width: 200,
        height: 100,
        left: 0,
        top: 0,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 200,
        height: 100,
        mode: FitMode.FILL,
      });

      expect(of.left).toBeCloseTo(0);
      expect(of.top).toBeCloseTo(0);
      expect(of.scaleX).toBeCloseTo(1);
      expect(of.scaleY).toBeCloseTo(1);
      expect(of.angle).toBeCloseTo(0);
    });

    it("should place container at origin with center-origin object at (0, 0)", () => {
      const obj = new fabric.Rect({
        width: 200,
        height: 100,
        left: 0,
        top: 0,
        originX: "center",
        originY: "center",
        strokeWidth: 0,
      });
      obj.setCoords();

      const of = new ObjectFit(obj, {
        width: 200,
        height: 100,
        mode: FitMode.FILL,
      });

      // center at (0, 0) with 200x100 => left/top at (-100, -50)
      expect(of.left).toBeCloseTo(-100);
      expect(of.top).toBeCloseTo(-50);
    });
  });

  describe("detachObject restoration", () => {
    it("should restore center/center origin and position on detach", () => {
      const obj = new fabric.Rect({
        width: 200,
        height: 100,
        left: 150,
        top: 100,
        originX: "center",
        originY: "center",
        strokeWidth: 0,
      });
      obj.setCoords();

      const of = new ObjectFit(null, { width: 200, height: 100 });
      of.setObject(obj, true, true);

      const detached = of.detachObject(true);

      expect(detached?.originX).toBe("center");
      expect(detached?.originY).toBe("center");
      expect(detached?.left).toBeCloseTo(150);
      expect(detached?.top).toBeCloseTo(100);
    });

    it("should restore left/top origin and position on detach", () => {
      const obj = new fabric.Rect({
        ...fabricObjectDefaults,
        width: 200,
        height: 100,
        left: 50,
        top: 30,
      });
      obj.setCoords();

      const of = new ObjectFit(null, { width: 200, height: 100 });
      of.setObject(obj, true, true);

      const detached = of.detachObject(true);

      expect(detached?.originX).toBe("left");
      expect(detached?.originY).toBe("top");
      expect(detached?.left).toBeCloseTo(50);
      expect(detached?.top).toBeCloseTo(30);
    });

    it("should restore scale and angle on detach", () => {
      const obj = new fabric.Rect({
        ...fabricObjectDefaults,
        width: 100,
        height: 100,
        left: 10,
        top: 20,
        scaleX: 2,
        scaleY: 3,
        angle: 45,
      });
      obj.setCoords();

      const of = new ObjectFit(null, { width: 100, height: 100 });
      of.setObject(obj, true, true);

      const detached = of.detachObject(true);

      expect(detached?.scaleX).toBeCloseTo(2);
      expect(detached?.scaleY).toBeCloseTo(3);
      expect(detached?.angle).toBeCloseTo(45);
    });
  });

  describe("object setter (uses instance useObjectTransform)", () => {
    it("should inherit transforms via object setter when useObjectTransform=true", () => {
      const of = new ObjectFit(null, {
        width: 200,
        height: 100,
        mode: FitMode.FILL,
        useObjectTransform: true,
      });

      const obj = new fabric.Rect({
        ...fabricObjectDefaults,
        width: 200,
        height: 100,
        left: 75,
        top: 40,
      });
      obj.setCoords();

      of.object = obj;
      of.recompute();

      expect(of.left).toBeCloseTo(75);
      expect(of.top).toBeCloseTo(40);
    });

    it("should normalize center origin via object setter", () => {
      const of = new ObjectFit(null, {
        width: 200,
        height: 100,
        mode: FitMode.FILL,
        useObjectTransform: true,
      });

      const obj = new fabric.Rect({
        width: 200,
        height: 100,
        left: 150,
        top: 100,
        originX: "center",
        originY: "center",
        strokeWidth: 0,
      });
      obj.setCoords();

      of.object = obj;
      of.recompute();

      expect(of.left).toBeCloseTo(50);
      expect(of.top).toBeCloseTo(50);
      expect(of.originX).toBe("left");
    });
  });

  describe("across fit modes", () => {
    const modes = [
      FitMode.FILL,
      FitMode.COVER,
      FitMode.CONTAIN,
      FitMode.NONE,
      FitMode.SCALE_DOWN,
    ];

    for (const mode of modes) {
      it(`should preserve position with ${mode} mode`, () => {
        const obj = new fabric.Rect({
          width: 200,
          height: 100,
          left: 150,
          top: 100,
          originX: "center",
          originY: "center",
          strokeWidth: 0,
        });
        obj.setCoords();

        const of = new ObjectFit(obj, {
          width: 300,
          height: 200,
          mode,
        });

        expect(of.left).toBeCloseTo(50);
        expect(of.top).toBeCloseTo(50);
        expect(of.originX).toBe("left");
        expect(of.originY).toBe("top");
      });
    }
  });
});

describe("useObjectTransform: false", () => {
  it("should not inherit position from object", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      width: 200,
      height: 100,
      left: 80,
      top: 60,
    });
    obj.setCoords();

    const of = new ObjectFit(obj, {
      width: 200,
      height: 100,
      mode: FitMode.FILL,
      useObjectTransform: false,
    });

    expect(of.left).toBeCloseTo(0);
    expect(of.top).toBeCloseTo(0);
  });

  it("should not inherit scale from object", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      width: 100,
      height: 100,
      scaleX: 3,
      scaleY: 2,
    });
    obj.setCoords();

    const of = new ObjectFit(obj, {
      width: 100,
      height: 100,
      mode: FitMode.FILL,
      useObjectTransform: false,
    });

    expect(of.scaleX).toBeCloseTo(1);
    expect(of.scaleY).toBeCloseTo(1);
  });

  it("should not inherit angle from object", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      width: 100,
      height: 100,
      angle: 45,
    });
    obj.setCoords();

    const of = new ObjectFit(obj, {
      width: 100,
      height: 100,
      mode: FitMode.FILL,
      useObjectTransform: false,
    });

    expect(of.angle).toBeCloseTo(0);
  });

  it("should not inherit center-origin position from object", () => {
    const obj = new fabric.Rect({
      width: 200,
      height: 100,
      left: 150,
      top: 100,
      originX: "center",
      originY: "center",
      strokeWidth: 0,
    });
    obj.setCoords();

    const of = new ObjectFit(obj, {
      width: 200,
      height: 100,
      mode: FitMode.FILL,
      useObjectTransform: false,
    });

    expect(of.left).toBeCloseTo(0);
    expect(of.top).toBeCloseTo(0);
    expect(of.originX).toBe("left");
  });

  it("should still restore transform on detachObject", () => {
    const obj = new fabric.Rect({
      width: 200,
      height: 100,
      left: 150,
      top: 100,
      originX: "center",
      originY: "center",
      strokeWidth: 0,
    });
    obj.setCoords();

    const of = new ObjectFit(null, { width: 200, height: 100 });
    of.setObject(obj, false, true);

    const detached = of.detachObject(true);

    expect(detached?.originX).toBe("center");
    expect(detached?.originY).toBe("center");
    expect(detached?.left).toBeCloseTo(150);
    expect(detached?.top).toBeCloseTo(100);
  });

  it("should work with setObject default (useObjectTransform=false)", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      width: 200,
      height: 100,
      left: 80,
      top: 60,
    });
    obj.setCoords();

    const of = new ObjectFit(null, {
      width: 200,
      height: 100,
      mode: FitMode.FILL,
    });
    of.setObject(obj); // default useObjectTransform=false
    of.recompute();

    expect(of.left).toBeCloseTo(0);
    expect(of.top).toBeCloseTo(0);
  });

  it("should allow manual positioning after creation", () => {
    const obj = new fabric.Rect({
      ...fabricObjectDefaults,
      width: 200,
      height: 100,
    });
    obj.setCoords();

    const of = new ObjectFit(obj, {
      width: 200,
      height: 100,
      mode: FitMode.COVER,
      useObjectTransform: false,
    });

    of.set({ left: 100, top: 50 });
    expect(of.left).toBe(100);
    expect(of.top).toBe(50);
  });

  describe("across fit modes", () => {
    const modes = [
      FitMode.FILL,
      FitMode.COVER,
      FitMode.CONTAIN,
      FitMode.NONE,
      FitMode.SCALE_DOWN,
    ];

    for (const mode of modes) {
      it(`should not inherit position with ${mode} mode`, () => {
        const obj = new fabric.Rect({
          ...fabricObjectDefaults,
          width: 200,
          height: 100,
          left: 80,
          top: 60,
        });
        obj.setCoords();

        const of = new ObjectFit(obj, {
          width: 300,
          height: 200,
          mode,
          useObjectTransform: false,
        });

        expect(of.left).toBeCloseTo(0);
        expect(of.top).toBeCloseTo(0);
      });
    }
  });
});

describe("ObjectFit.object setter", () => {
  it("should set object via property assignment", () => {
    const of = new ObjectFit(null, { width: 100, height: 100 });
    const obj = makeObject();

    of.object = obj;
    expect(of.object).toBe(obj);
  });

  it("should clear object when assigning null", () => {
    const obj = makeObject();
    const of = new ObjectFit(obj, { width: 100, height: 100 });

    of.object = null;
    expect(of.object).toBeNull();
  });
});
