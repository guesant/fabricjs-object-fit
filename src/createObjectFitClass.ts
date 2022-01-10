import { fabric } from "fabric";
import { FitMode } from "./enums/FitMode";
import { fabricObjectDefaults } from "./misc/Fabric/fabricObjectDefaults";
import { getEnlivedObject } from "./misc/Fabric/getEnlivedObject";
import { defaultPosition } from "./misc/Position/defaultPosition";
import { parsePosition } from "./misc/Position/parsePosition";
import { IFabricNS } from "./types/IFabricNS";
import { IFitMode } from "./types/IFitMode";
import { IObjectFit } from "./types/IObjectFit";
import { IObjectFitConstructor } from "./types/IObjectFitConstructor";
import { IObjectFitConstructorOptions } from "./types/IObjectFitConstructorOptions";
import { IObjectFitSerialized } from "./types/IObjectFitSerialized";
import { IPosition } from "./types/IPosition";
import { getFittedObject } from "./utils/getFittedObject";

export const createObjectFitClass = (ns: IFabricNS): IObjectFitConstructor => {
  const resetTransformOptions = ns.util.qrDecompose([1, 0, 0, 1, 0, 0]);

  class ObjectFit extends ns.Group implements IObjectFit {
    type = "objectFit";

    mode: IFitMode;

    width: number;

    height: number;

    useObjectTransform: boolean;

    enableRecomputeOnScaled: boolean;

    enableRecomputeOnScaling: boolean;

    position: Partial<IPosition> = {};

    private _object: fabric.Object | null = null;

    private _objectGroup: fabric.Group | null = null;

    // both will store the same shape of object transform info, but
    // _loadedObjectTransform will be cleaned after `recompute` and
    // _loadedObjectInitialTransform will be kept the same until the
    // the object get replaced by setObject.

    private _loadedObjectTransform: Partial<fabric.IObjectOptions> = {};

    private _loadedObjectInitialTransform: Partial<fabric.IObjectOptions> = {};

    get object() {
      return this._object;
    }

    set object(object: fabric.Object | null) {
      this.setObject(object ?? null, this.useObjectTransform);
    }

    setObject(
      object: fabric.Object | null,
      useObjectTransform = false,
      restorePreviousObjectTransform = true
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
          ns.util.qrDecompose(transformMatrix)
        );

        if (useObjectTransform) {
          this._loadedObjectTransform = this._loadedObjectInitialTransform;
        }

        object.set(resetTransformOptions);
        object.setCoords();

        object.group?.removeWithUpdate(object);

        this._object = object;

        this._objectGroup = new ns.Group([object], { ...fabricObjectDefaults });
      }
    }

    constructor(
      object?: fabric.Object | null | undefined,
      options: IObjectFitConstructorOptions = {}
    ) {
      super(undefined, { ...fabricObjectDefaults });

      const {
        width = NaN,
        height = NaN,
        mode = FitMode.FILL,
        useObjectTransform = true,
        enableRecomputeOnScaled = true,
        enableRecomputeOnScaling = false,
        position: { x = defaultPosition.x, y = defaultPosition.y } = {}
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

      this.on("scaled", this.handleRecomputeOnScaled);
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
        height: this.getScaledHeight()
      } as any);

      this.setCoords();

      this.recompute();

      shouldRenderCanvas && this.canvas?.requestRenderAll();
    }

    recompute() {
      if (this._objectGroup) {
        if (Number.isNaN(this.width)) {
          this.width = this._objectGroup.width!;
        }

        if (Number.isNaN(this.height)) {
          this.height = this._objectGroup.height!;
        }
      }

      const { width, height, mode, position } = this;

      const currentTransformOptions = this.getCurrentTransformOptions();

      this.resetContainer();

      if (this._objectGroup && !Number.isNaN(width) && !Number.isNaN(height)) {
        const fittedObject = getFittedObject(
          this._objectGroup,
          {
            mode,
            width,
            height,
            position
          },
          ns
        )!;
        this.addWithUpdate(fittedObject);
      }

      this.set(currentTransformOptions as any);
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
        height: this.getScaledHeight()
      } as any);

      this.setCoords();

      for (const object of this.getObjects()) {
        this.removeWithUpdate(object);
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
        left = 0
      } = {
        ...fabricObjectDefaults,
        ...resetTransformOptions,
        ...this,
        ...this._loadedObjectTransform
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
        skewY
      };
    }

    detachObject(restorePreviousObjectTransform = true) {
      const currentObject = this._object;

      if (this._objectGroup) {
        this._objectGroup.group?.removeWithUpdate(this._objectGroup);
        this._objectGroup = null;
      }

      if (this._object) {
        this._object.group?.removeWithUpdate(this._object);

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

    toObject(propertiesToInclude?: string[]): IObjectFitSerialized {
      return ns.util.object.extend(
        (this as any).callSuper(
          "toObject",
          ["mode", "width", "height"].concat(propertiesToInclude ?? [])
        ),
        {
          position: {
            x: this.position.x?.toJSON(),
            y: this.position.y?.toJSON()
          },
          object: this.object?.toObject()
        }
      );
    }

    static fromObject(objectFitObject: IObjectFitSerialized, callback?: any) {
      const {
        mode,
        width,
        height,
        object,
        position: _position,
        ...options
      } = objectFitObject;

      getEnlivedObject(
        object,
        (enlivedObject) => {
          const objectFit = new ObjectFit(enlivedObject, {
            mode,
            width,
            height,
            position: parsePosition(_position)
          });

          objectFit.set(options as any);
          objectFit.setCoords();

          callback?.(objectFit);
        },
        ns
      );
    }
  }

  return ObjectFit;
};
