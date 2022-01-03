import { fabric } from "fabric";
import { getFittedObject } from "./utils/getFittedObject";
import { fabricObjectDefaults } from "./misc/fabricObjectDefaults";
import { defaultPosition } from "./Position/defaultPosition";
import { parsePositionSerialized } from "./Position/parsePositionSerialized";
import { IFabricNS } from "./types/IFabricNS";
import { IFitMode } from "./types/IFitMode";
import { IObjectFitConstructor } from "./types/IObjectFitConstructor";
import { IObjectFitConstructorOptions } from "./types/IObjectFitConstructorOptions";
import { IObjectFitSerialized } from "./types/IObjectFitSerialized";
import { IPosition } from "./types/IPosition";

export const createObjectFitClass = (ns: IFabricNS): IObjectFitConstructor => {
  const resetTransformOptions = ns.util.qrDecompose([1, 0, 0, 1, 0, 0]);

  class ObjectFit extends ns.Group {
    type = "objectFit";

    mode: IFitMode;

    width: number;

    height: number;

    useObjectTransform: boolean;

    position: Partial<IPosition> = {};

    private _object: fabric.Object | null = null;

    private _objectInitialOptions: Partial<fabric.IObjectOptions> = {};

    private _objectGroup: fabric.Group | null = null;

    get object() {
      return this._object;
    }

    set object(object: fabric.Object | null) {
      this.setObject(object, this.useObjectTransform);
    }

    setObject(
      object: fabric.Object | null,
      useObjectTransform = false,
      restorePreviousObjectTransform = true
    ) {
      this.detachObject(restorePreviousObjectTransform);

      if (object) {
        if (useObjectTransform) {
          const transformMatrix = object.calcTransformMatrix();

          this._objectInitialOptions.top = object.top;
          this._objectInitialOptions.left = object.left;

          this._objectInitialOptions.originX = object.originX;
          this._objectInitialOptions.originY = object.originY;

          Object.assign(
            this._objectInitialOptions,
            ns.util.qrDecompose(transformMatrix)
          );
        }

        object.set(resetTransformOptions);
        object.setCoords();

        object.group?.removeWithUpdate(object);

        this._object = object;

        this._objectGroup = new ns.Group([object], {
          ...fabricObjectDefaults
        });
      }
    }

    constructor(object: fabric.Object, options: IObjectFitConstructorOptions) {
      super(undefined, { ...fabricObjectDefaults });

      const {
        mode,
        width,
        height,
        position: { x = defaultPosition.x, y = defaultPosition.y } = {},
        useObjectTransform = true
      } = options;

      this.mode = mode;

      this.width = width;
      this.height = height;

      this.position.x = x;
      this.position.y = y;

      this.useObjectTransform = useObjectTransform;
      this.object = object;

      this.recompute();
    }

    recompute() {
      const { width, height, mode, position } = this;

      const currentTransformOptions = this.getCurrentTransformOptions();

      this.resetContainer();

      if (this._objectGroup) {
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

      this._objectInitialOptions = {};
      this.dirty = true;
    }

    detachObject(restorePreviousObjectTransform = true) {
      const obj = this._object;

      if (this._objectGroup) {
        this._objectGroup.group?.removeWithUpdate(this._objectGroup);
        this._objectGroup = null;
      }

      if (this._object) {
        this._object.group?.removeWithUpdate(this._object);

        if (restorePreviousObjectTransform) {
          this._object.set(this.getCurrentTransformOptions());
          this._object.setCoords();
        }

        this._object = null;
      }

      this._objectInitialOptions = {};

      return obj;
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
        left,
        top,
        angle,
        originX,
        originY,
        scaleX,
        scaleY,
        skewX,
        skewY
      } = {
        ...this,
        ...this._objectInitialOptions
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

    toObject(): IObjectFitSerialized {
      const obj = this.object;
      return ns.util.object.extend((this as any).callSuper("toObject"), {
        mode: this.mode,
        width: this.width,
        height: this.height,
        position: JSON.stringify(this.position),
        object: obj?.toObject()
      });
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

      ns.util.enlivenObjects(
        [object],
        ([enlivedObject]: [fabric.Object]) => {
          const objectFit = new ObjectFit(enlivedObject, {
            mode,
            width,
            height,
            position: parsePositionSerialized(_position)
          });

          objectFit.set(options as any);
          objectFit.setCoords();

          callback && callback(objectFit);
        },
        undefined as any
      );
    }
  }

  return ObjectFit;
};
