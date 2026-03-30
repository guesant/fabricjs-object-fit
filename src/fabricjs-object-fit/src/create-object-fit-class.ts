import type { FabricObject, FabricObjectProps } from "fabric";
import { FitMode } from "./enums/fit-mode";
import { detachObjectFromGroup } from "./misc/fabric/detach-object-from-group";
import { fabricObjectDefaults } from "./misc/fabric/fabric-object-defaults";
import { getEnlivedObject } from "./misc/fabric/get-enlived-object";
import { defaultPosition } from "./misc/position/default-position";
import { parsePosition } from "./misc/position/parse-position";
import type { IFabricNS } from "./types/i-fabric-ns";
import type { IFitMode } from "./types/i-fit-mode";
import type { IObjectFit } from "./types/i-object-fit";
import type { IObjectFitConstructor } from "./types/i-object-fit-constructor";
import type { IObjectFitConstructorOptions } from "./types/i-object-fit-constructor-options";
import type { IObjectFitSerialized } from "./types/i-object-fit-serialized";
import type { IPosition } from "./types/i-position";
import { getFittedObject } from "./utils/get-fitted-object";

export const createObjectFitClass = (ns: IFabricNS): IObjectFitConstructor => {
  const resetTransformOptions = ns.util.qrDecompose([1, 0, 0, 1, 0, 0]);

  class ObjectFit extends ns.Group implements IObjectFit {
    static type = "objectFit";

    mode: IFitMode;

    width: number;

    height: number;

    useObjectTransform: boolean;

    enableRecomputeOnScaled: boolean;

    enableRecomputeOnScaling: boolean;

    position: Partial<IPosition> = {};

    private _object: FabricObject | null = null;

    private _objectGroup: InstanceType<typeof ns.Group> | null = null;

    // both will store the same shape of object transform info, but
    // _loadedObjectTransform will be cleaned after `recompute` and
    // _loadedObjectInitialTransform will be kept the same until the
    // the object get replaced by setObject.

    private _loadedObjectTransform: Partial<FabricObjectProps> = {};

    private _loadedObjectInitialTransform: Partial<FabricObjectProps> = {};

    get object() {
      return this._object;
    }

    set object(object: FabricObject | null) {
      this.setObject(object ?? null, this.useObjectTransform);
    }

    setObject(
      object: FabricObject | null,
      useObjectTransform = false,
      restorePreviousObjectTransform = true,
    ) {
      this.detachObject(restorePreviousObjectTransform);

      if (object) {
        const transformMatrix = object.calcTransformMatrix();

        this._loadedObjectInitialTransform.top = object.top;
        this._loadedObjectInitialTransform.left = object.left;

        this._loadedObjectInitialTransform.originX = object.originX;
        this._loadedObjectInitialTransform.originY = object.originY;

        Object.assign(
          this._loadedObjectInitialTransform,
          ns.util.qrDecompose(transformMatrix),
        );

        if (useObjectTransform) {
          this._loadedObjectTransform = this._loadedObjectInitialTransform;
        }

        object.set(resetTransformOptions);
        object.setCoords();

        detachObjectFromGroup(object);

        this._object = object;

        this._objectGroup = new ns.Group([object], {
          ...fabricObjectDefaults,
          layoutManager: new ns.LayoutManager(new ns.FixedLayout()),
        });
      }
    }

    constructor(
      object?: FabricObject | null | undefined,
      options: IObjectFitConstructorOptions = {},
    ) {
      super([], {
        ...fabricObjectDefaults,
        layoutManager: new ns.LayoutManager(new ns.FixedLayout()),
      });

      const {
        width = NaN,
        height = NaN,
        mode = FitMode.FILL,
        useObjectTransform = true,
        enableRecomputeOnScaled = true,
        enableRecomputeOnScaling = false,
        position: { x = defaultPosition.x, y = defaultPosition.y } = {},
      } = options;

      this.mode = mode;

      this.width = width;
      this.height = height;

      this.position.x = x;
      this.position.y = y;

      this.useObjectTransform = useObjectTransform;
      this.enableRecomputeOnScaled = enableRecomputeOnScaled;
      this.enableRecomputeOnScaling = enableRecomputeOnScaling;

      this.object = object ?? null;

      if (object) {
        this.recompute();
      }

      this.handleRecomputeOnScaled = this.handleRecomputeOnScaled.bind(this);
      this.handleRecomputeOnScaling = this.handleRecomputeOnScaling.bind(this);

      // In fabric v7, "scaled" was replaced by "modified" (fires after any transform)
      this.on("modified", this.handleRecomputeOnScaled);
      this.on("scaling", this.handleRecomputeOnScaling);
    }

    handleRecomputeOnScaled() {
      this.enableRecomputeOnScaled && this.handleScaled();
    }

    handleRecomputeOnScaling() {
      this.enableRecomputeOnScaling && this.handleScaled();
    }

    handleScaled(shouldRenderCanvas = true) {
      this.setCoords();

      this.set({
        scaleX: 1,
        scaleY: 1,
        width: this.getScaledWidth(),
        height: this.getScaledHeight(),
      } as unknown as Partial<this>);

      this.setCoords();

      this.recompute();

      shouldRenderCanvas && this.canvas?.requestRenderAll();
    }

    recompute() {
      if (this._objectGroup) {
        if (Number.isNaN(this.width)) {
          this.width = this._objectGroup.width ?? 0;
        }

        if (Number.isNaN(this.height)) {
          this.height = this._objectGroup.height ?? 0;
        }
      }

      const { width, height, mode, position } = this;

      const currentTransformOptions = this.getCurrentTransformOptions();

      this.resetContainer();

      if (this._objectGroup && !Number.isNaN(width) && !Number.isNaN(height)) {
        // In fabric v7, exitGroup applies the parent's transform to the child
        // when it leaves a group. We must detach _objectGroup from any previous
        // wrapper group and reset its transform to a clean state before fitting.
        detachObjectFromGroup(this._objectGroup);
        this._objectGroup.set({
          ...resetTransformOptions,
          ...fabricObjectDefaults,
          left: 0,
          top: 0,
        });
        this._objectGroup.setCoords();

        const fittedObject = getFittedObject(
          this._objectGroup,
          {
            mode,
            width,
            height,
            position,
          },
          ns,
        );
        if (!fittedObject) return;
        this.add(fittedObject);
      }

      this.set(currentTransformOptions as unknown as Partial<this>);
      // Restore intended dimensions (resetContainer overwrites with getScaledWidth/Height)
      this.width = width;
      this.height = height;
      this.setCoords();

      this._loadedObjectTransform = {};
      this.dirty = true;
    }

    private resetContainer() {
      this.setCoords();

      this.set({
        ...resetTransformOptions,
        top: 0,
        left: 0,
        width: this.getScaledWidth(),
        height: this.getScaledHeight(),
      } as unknown as Partial<this>);

      this.setCoords();

      for (const object of this.getObjects()) {
        this.remove(object);
      }
    }

    private getCurrentTransformOptions() {
      const {
        angle,
        skewX,
        skewY,
        scaleX,
        scaleY,
        originX,
        originY,
        top = 0,
        left = 0,
      } = {
        ...fabricObjectDefaults,
        ...resetTransformOptions,
        ...this,
        ...this._loadedObjectTransform,
      };

      return {
        left,
        top,
        angle,
        originX,
        originY,
        scaleX,
        scaleY,
        skewX,
        skewY,
      };
    }

    detachObject(restorePreviousObjectTransform = true) {
      const currentObject = this._object;

      if (this._objectGroup) {
        detachObjectFromGroup(this._objectGroup);
        this._objectGroup = null;
      }

      if (this._object) {
        detachObjectFromGroup(this._object);

        this._object.setCoords();

        if (restorePreviousObjectTransform) {
          this._object.set(this._loadedObjectInitialTransform);
          this._object.setCoords();
        }

        this._object = null;
      }

      this._loadedObjectTransform = {};
      this._loadedObjectInitialTransform = {};

      return currentObject;
    }

    // @ts-expect-error - v7's toObject has complex generics; our return type extends it
    toObject(propertiesToInclude?: string[]): IObjectFitSerialized {
      const base = (
        super.toObject as (keys?: string[]) => Record<string, unknown>
      )(["mode", "width", "height"].concat(propertiesToInclude ?? []));
      return {
        ...base,
        position: {
          x: this.position.x?.toJSON(),
          y: this.position.y?.toJSON(),
        },
        object: this.object?.toObject(),
      } as IObjectFitSerialized;
    }

    static async fromObject(
      objectFitObject: IObjectFitSerialized,
    ): Promise<InstanceType<typeof ObjectFit>> {
      const {
        mode,
        width,
        height,
        object,
        position: _position,
        ...options
      } = objectFitObject;

      const enlivedObject = await getEnlivedObject(
        object as Record<string, unknown> | null | undefined,
        ns,
      );

      const objectFit = new ObjectFit(enlivedObject, {
        mode,
        width,
        height,
        position: parsePosition(_position),
      });

      objectFit.set(options as unknown as Partial<ObjectFit>);
      objectFit.setCoords();

      return objectFit;
    }
  }

  return ObjectFit as unknown as IObjectFitConstructor;
};
