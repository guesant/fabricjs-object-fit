---
title: useObjectTransform
---

# Understanding `useObjectTransform`

The `useObjectTransform` property controls whether the ObjectFit container preserves or discards the original object's transform (position, scale, rotation, skew) when the object is added.

## The Problem It Solves

When you load an image or create a Fabric.js object, it may already carry transform properties: a position on the canvas, a rotation angle, a non-uniform scale, or a skew. When you wrap that object in an ObjectFit container, the library needs to decide what to do with those pre-existing transforms.

There are two valid behaviors:

1. **Preserve transforms** — The ObjectFit container inherits the object's position/rotation/scale. The container appears where the object was, as if you swapped the object for a fitted version in place.

2. **Discard transforms** — The ObjectFit container starts with a clean identity transform (position 0,0, no rotation, no scale). You control placement yourself.

## How It Works

### Default behavior

The constructor defaults `useObjectTransform` to `true`:

```ts
const container = new ObjectFit(img, {
  width: 400,
  height: 400,
  mode: "cover",
  // useObjectTransform defaults to true
});
```

With `useObjectTransform: true`, the library:

1. Captures the object's current transform via `qrDecompose()` on its transform matrix (position, scale, rotation, skew, origin).
2. Resets the object to an identity transform internally.
3. Computes the fit (cover, contain, etc.) on the clean object.
4. Re-applies the captured transform to the ObjectFit container itself.

The result: the container appears at the same position, rotation, and scale as the original object.

### Disabling it

```ts
const container = new ObjectFit(img, {
  width: 400,
  height: 400,
  mode: "cover",
  useObjectTransform: false,
});
```

With `useObjectTransform: false`, the captured transform is stored but **not applied**. The container starts at position (0, 0) with no rotation or scale. You position it yourself:

```ts
container.set({ left: 100, top: 50, angle: 15 });
```

## When to Use Each

### Use `true` (default) when:

- **Replacing an existing object on the canvas.** You have an image at position (200, 150) rotated 30 degrees, and you want to wrap it in an ObjectFit container that lands in the same spot.

- **Round-trip serialization.** When deserializing from JSON, the object may carry saved transforms that should be restored.

- **Swapping content.** Using the `object` setter (which respects the instance's `useObjectTransform` property) to replace one image with another while keeping the container's position.

```ts
// The container stays where it is, just the content changes
container.object = newImage;
container.recompute();
```

### Use `false` when:

- **Building a fresh layout.** You are placing containers at specific canvas positions yourself and don't want the source image's transforms to interfere.

- **Loading images from URLs.** Freshly loaded images typically have identity transforms, so `useObjectTransform` has no visible effect. But setting it to `false` makes the intent explicit and avoids surprises if the image somehow carries transforms.

- **Creating galleries or grids.** When you control the exact position of each container.

```ts
const container = new ObjectFit(img, {
  width: 200,
  height: 200,
  mode: "contain",
  useObjectTransform: false,
});

container.set({ left: column * 220, top: row * 220 });
canvas.add(container);
```

## The `setObject` Method vs. the `object` Setter

There is a subtle difference in defaults:

| Method | Default `useObjectTransform` |
|---|---|
| `new ObjectFit(img, { ... })` | `true` (from constructor) |
| `container.object = img` | Uses the instance's `useObjectTransform` property (default `true`) |
| `container.setObject(img)` | `false` |
| `container.setObject(img, true)` | `true` (explicit) |

The `setObject()` method defaults to `false` because it is typically called when programmatically replacing content, where you usually want the container to stay put. The `object` setter delegates to `setObject` with the instance's `useObjectTransform` value, preserving the behavior chosen at construction time.

```ts
// These behave differently:

// Uses instance property (default: true) — container may move
container.object = newImage;

// Explicit false — container stays in place
container.setObject(newImage);

// Explicit true — container inherits newImage's transforms
container.setObject(newImage, true);
```

## What Transforms Are Captured

When `useObjectTransform` is active, the following properties are captured from the original object:

- `left`, `top` — position
- `originX`, `originY` — transform origin
- `scaleX`, `scaleY` — scale factors
- `angle` — rotation in degrees
- `skewX`, `skewY` — skew factors

These are extracted using Fabric.js's `util.qrDecompose()` on the object's full transform matrix, ensuring that nested group transforms are correctly accounted for.

## Internal Details

The ObjectFit class maintains two private properties for transform tracking:

- **`_loadedObjectInitialTransform`** — Permanently stores the original transform until the object is replaced. Used as a reference for the initial state.

- **`_loadedObjectTransform`** — Temporary storage that is consumed during `recompute()`. When `useObjectTransform` is `true`, this is populated from `_loadedObjectInitialTransform`. After recompute applies these values to the container, they are cleared.

The `restorePreviousObjectTransform` parameter in `setObject()` controls whether the previous object's initial transform is restored when it is detached from the container. This defaults to `true`, so swapping objects puts the old one back where it was.

## Why Demos Use `false`

All the [demo examples](/examples/) use `useObjectTransform: false`:

```ts
const container = new ObjectFit(img, {
  width: 400,
  height: 400,
  mode: "cover",
  useObjectTransform: false,
});
```

This is intentional. The demos place containers at specific positions on the canvas to showcase each fit mode and position option. Using `true` would cause the containers to inherit whatever transforms the loaded images carry, making the demo layout unpredictable.

If you are following a demo to get started and want to control placement yourself, use `false`. If you are integrating into an existing canvas where objects already have positions, use `true` (the default).
