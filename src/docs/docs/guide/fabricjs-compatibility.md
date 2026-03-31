---
title: Fabric.js Compatibility
---

# Fabric.js Compatibility

**fabricjs-object-fit** requires **Fabric.js v7+**. It was rebuilt from scratch for the v7 API and does not support earlier versions.

This page documents the breaking changes introduced across Fabric.js major versions (v4 through v7) and explains how this library handles them. If you are migrating a project from an older Fabric.js version, this guide will help you understand what changed and why.

## Breaking Changes from Fabric.js v4 to v7

### v4 to v5

Fabric.js v5 introduced relatively minor API changes, but one is directly relevant to this library:

**Transform events removed.** The dedicated `object:scaled`, `object:rotated`, `object:moved`, and `object:skewed` events were removed. They were replaced by `object:modified`, which fires after any transform and includes an `action` property to distinguish the operation type.

```ts
// v4
object.on("scaled", handler);

// v5+
object.on("modified", (e) => {
  // e.action === "scale" | "rotate" | "drag" | ...
  handler();
});
```

### v5 to v6 (the big rewrite)

Fabric.js v6 was a **full TypeScript rewrite** with sweeping API changes.

#### Namespace and imports

The `fabric` namespace object no longer exists. Instead, you import classes directly:

```ts
// v4/v5
import { fabric } from "fabric";
const canvas = new fabric.Canvas("c");

// v6+
import { Canvas, Rect, FabricImage } from "fabric";
// or
import * as fabric from "fabric";
const canvas = new fabric.Canvas("c");
```

- Drop `@types/fabric` (types are now built-in).
- Node.js has a separate entry point: `import { Canvas } from "fabric/node"`.

#### Image class renamed

`fabric.Image` became `FabricImage` to avoid collision with the global `Image` constructor:

```ts
// v4/v5
const img = new fabric.Image(element);

// v6+
const img = new FabricImage(element);
```

#### Callbacks replaced by Promises

All async APIs (notably `Image.fromURL`) now return Promises:

```ts
// v4/v5 (callback)
fabric.Image.fromURL(url, (img) => { /* ... */ });

// v6+ (Promise)
const img = await FabricImage.fromURL(url);
```

#### Coordinate system overhaul

Fabric.js v6 formalized the separation between **scene coordinates** (where objects exist mathematically) and **viewport coordinates** (what the user sees on screen after zoom/pan).

| v4/v5 | v6+ |
|---|---|
| `canvas.getPointer(e)` | Deprecated (removed in v7). Use `canvas.getScenePoint(e)` or `canvas.getViewportPoint(e)` |
| `event.absolutePointer` | `event.scenePoint` |
| `event.pointer` | `event.viewportPoint` |

Geometry methods like `getCoords()`, `intersectsWithRect()`, `containsPoint()`, and `getBoundingRect()` no longer accept `absolute` or `calculate` parameters. They always operate in scene coordinates.

New positioning methods were introduced:

```ts
// scene plane (absolute canvas position)
object.getXY();
object.setXY(point);

// parent plane (relative to group)
object.getRelativeXY();
object.setRelativeXY(point);
```

#### Group rewrite and LayoutManager

The group system was completely rewritten:

- **Strict single-parent tree:** an object can belong to only one parent at a time.
- **`addWithUpdate()` removed.** Use `add()` with the new `LayoutManager`.
- **New `LayoutManager` system:** controls how groups compute their size and position. The default is `fit-content` (auto-sizing). For fixed-size containers, use `FixedLayout`.

```ts
import { Group, LayoutManager, FixedLayout } from "fabric";

const group = new Group([object], {
  layoutManager: new LayoutManager(new FixedLayout()),
});
```

#### Canvas sizing

`setWidth()` and `setHeight()` were deprecated in v6 (fully removed in v7). Use `setDimensions()`:

```ts
// v4/v5
canvas.setWidth(800);

// v6+
canvas.setDimensions({ width: 800, height: 600 });
```

#### Other v6 changes

- `canvas.dispose()` became **async** (returns a Promise).
- `getCenter()` removed; use `getCenterPoint()`.
- `add()` now returns array length (like `Array.push`).
- `insertAt()` signature changed from `insertAt(object, index)` to `insertAt(index, ...objects)`.
- Setter methods (`setBackgroundColor`, `setBackgroundImage`, etc.) removed; assign properties directly.
- Method chaining deprecated.

### v6 to v7

Fabric.js v7 introduced fewer but impactful changes:

#### Origin defaults changed

**The single most disruptive change in v7.** `originX` and `originY` defaults changed from `'left'`/`'top'` to `'center'`/`'center'`. Objects are now positioned by their center point by default.

```ts
// v6: object at (100, 100) means top-left corner is at (100, 100)
// v7: object at (100, 100) means center is at (100, 100)
```

#### exitGroup applies parent transform

When an object leaves a group via `exitGroup()`, Fabric.js v7 applies the parent group's transform to the child. In v4-v6, the child kept its local coordinates.

#### Removed APIs

- `setWidth()` / `setHeight()` fully removed (deprecated since v6).
- `getPointer()` fully removed (deprecated since v6).

## How fabricjs-object-fit Handles These Changes

This library was designed specifically for Fabric.js v7, using **dependency injection** so it never imports `fabric` directly. Here is how each breaking change is addressed:

### Event system

The library listens to `"modified"` instead of `"scaled"`:

```ts
// create-object-fit-class.ts
this.on("modified", this.handleRecomputeOnScaled);
```

### Group and LayoutManager

All internal groups use `FixedLayout` to prevent automatic layout recalculation, which would interfere with the precise sizing and positioning that object-fit requires:

```ts
new ns.Group([object], {
  layoutManager: new ns.LayoutManager(new ns.FixedLayout()),
});
```

### Origin defaults

The library explicitly sets `originX: "left"` and `originY: "top"` on all internal objects via `fabricObjectDefaults`, ensuring consistent positioning regardless of Fabric.js's default origin:

```ts
const fabricObjectDefaults = {
  originX: "left",
  originY: "top",
  strokeWidth: 0,
};
```

When [`useObjectTransform`](/guide/use-object-transform) is enabled and an object uses Fabric v7's default `center/center` origin, the library automatically converts the object's position to `left/top` coordinates using `translateToGivenOrigin()` before applying the transform to the container. This ensures the container appears at the correct visual position regardless of the object's origin settings.

### exitGroup transform behavior

When recomputing the fit, the library explicitly detaches objects from their previous group and resets their transform to a clean state. This prevents Fabric.js v7's `exitGroup` transform application from shifting the fitted object:

```ts
detachObjectFromGroup(this._objectGroup);
this._objectGroup.set({
  ...resetTransformOptions,
  ...fabricObjectDefaults,
  left: 0,
  top: 0,
});
```

### Dependency injection (DI)

The `setup(fabric)` pattern means the library is decoupled from any specific Fabric.js import style:

```ts
import * as fabric from "fabric";
import { setup } from "fabricjs-object-fit";

const { ObjectFit } = setup(fabric);
```

This makes it compatible with ESModule imports, UMD bundles, and Node.js entry points alike.

## Version Support Matrix

| Fabric.js Version | fabricjs-object-fit Support |
|---|---|
| v4.x | Not supported |
| v5.x | Not supported |
| v6.x | Not supported |
| v7.x | **Supported** (v7.0.0+) |

## References

- [Upgrading to Fabric.js 6.0](https://fabricjs.com/docs/upgrading/upgrading-to-fabric-60/)
- [Upgrading to Fabric.js 7.0](https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/)
- [Fabric.js 5.0 Breaking Changes](https://fabric5.fabricjs.com/v5-breaking-changes)
- [Breaking changes for Fabric 6.0 (GitHub #8299)](https://github.com/fabricjs/fabric.js/issues/8299)
- [Fabric.js CHANGELOG](https://github.com/fabricjs/fabric.js/blob/master/CHANGELOG.md)
