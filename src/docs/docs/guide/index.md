---
title: Guide
---

## What is fabricjs-object-fit?

Fabric.js gives you a powerful canvas toolkit, but it has no built-in way to say "fit this image inside a 400×400 box without distortion." In the browser, CSS `object-fit` solves this in one property. **fabricjs-object-fit** brings that same mental model to Fabric.js.

You pass your `fabric` instance to `setup(fabric)`, and it returns an `ObjectFit` class that extends `fabric.Group`. This dependency-injection pattern means the library never imports Fabric.js directly, staying compatible across bundler configurations.

## Install

### From NPM

```bash
# with bun
bun add fabricjs-object-fit

# with pnpm
pnpm add fabricjs-object-fit

# with yarn
yarn add fabricjs-object-fit

# with npm
npm install fabricjs-object-fit
```

```ts
import {} from "fabricjs-object-fit";
```

### Browser / CDN

#### UMD

```html
<script src="https://unpkg.com/fabricjs-object-fit@latest/lib/index.umd.js"></script>
<script>
  const {} = window.FabricJSObjectFit;
</script>
```

#### ESModule

```html
<script type="module">
  import {} from "https://unpkg.com/fabricjs-object-fit@latest/lib/index.mjs";
</script>
```

## Usage

Lets suppose that we have something like this in CSS:

```css
.container {
  width: 400px;
  height: 400px;
  object-fit: cover;
}
```

And here is the same behavior written in FabricJS:

```ts
import * as fabric from "fabric";
import { setup } from "fabricjs-object-fit";

// if you are using the UMD version
// const { setup } = window.FabricJSObjectFit;

const { ObjectFit } = setup(fabric);

async function doRender() {
  const canvas = new fabric.Canvas("c");

  const img = await fabric.FabricImage.fromURL("https://placehold.co/640x360");

  const container = new ObjectFit(img, {
    width: 400,
    height: 400,
    mode: "cover" // supported modes are: "cover" | "contain" | "fill" | "none" | "scale-down"
  });

  canvas.add(container);

  canvas.renderAll();
}

doRender();
```

- Changing the container image to another with different dimensions

```ts
const img2 = await fabric.FabricImage.fromURL("...");
container.setObject(img2);
container.recompute();
canvas.requestRenderAll();
```

- Changing the container mode

```ts
container.mode = "contain";
container.recompute();
canvas.requestRenderAll();
```

- Changing the container dimensions

```ts
container.width = 300;
container.height = 700;
container.recompute();
canvas.requestRenderAll();
```

- Setting the image position in the container

> Behaviors like CSS's [object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position).

In the CSS we have the syntax `object-position: size-for-x-axis size-for-y-axis`. In this library we are going to declare the `size-for-?-axis` with the [`Point`](/api/fabricjs-object-fit/namespaces/Point/) API.

So lets suppose we have this in the CSS:

```css
.container {
  object-position: 50px 10px;
}
```

Now with `ObjectFit`:

```ts
const container = new ObjectFit(img, {
  // ...
  position: {
    x: Point.fromAbsolute(50),
    y: Point.fromAbsolute(10)
  }
});
```

Some other supported units:

```ts
// object-fit: 10px ...;
container.position.x = Point.fromAbsolute(10);

// object-fit: 50% ...;
container.position.x = Point.fromPercentage("50%");

// object-fit: left ...;
container.position.x = Point.X.LEFT; // Point.X.LEFT; Point.X.CENTER; Point.X.RIGHT;

// object-fit: ... bottom;
container.position.y = Point.Y.BOTTOM; // Point.Y.TOP; Point.Y.CENTER; Point.Y.BOTTOM;
```

Take a look at [`Point`](/api/fabricjs-object-fit/namespaces/Point/) on the API docs.

## Fit Modes Explained

The `mode` option controls how the object scales inside the container. Each mode mirrors its CSS `object-fit` counterpart.

### `cover`

Scales the object uniformly so the container is completely filled. Parts of the object that overflow are clipped.

**When to use:** you need the container fully filled with no empty space. For example, a background image behind a text overlay, or a profile picture in a circular frame.

```ts
const container = new ObjectFit(img, {
  width: 400, height: 400,
  mode: "cover",
});
```

### `contain`

Scales the object uniformly so it fits entirely within the container. Empty space (letterboxing) may appear on two sides.

**When to use:** showing the entire object matters more than filling the container. For example, product images in a grid where you do not want cropping.

```ts
const container = new ObjectFit(img, {
  width: 400, height: 400,
  mode: "contain",
});
```

### `fill`

Stretches the object independently on each axis to exactly match the container dimensions. The aspect ratio is **not** preserved.

**When to use:** you explicitly want the object to match the container size, regardless of distortion. For example, stretching a gradient or solid-color rectangle to fill a slot.

```ts
const container = new ObjectFit(img, {
  width: 400, height: 400,
  mode: "fill",
});
```

### `none`

Displays the object at its original (intrinsic) size. If the object is larger than the container, it is clipped. If smaller, there is empty space.

**When to use:** you want pixel-perfect rendering at the object's native resolution. For example, displaying a UI icon at its designed size.

```ts
const container = new ObjectFit(img, {
  width: 400, height: 400,
  mode: "none",
});
```

### `scale-down`

Acts like `contain` if the object is larger than the container, and like `none` if it is smaller. The object is never scaled *up*.

**When to use:** small objects should stay crisp at their native size but large objects should shrink to fit. For example, user-uploaded avatars that vary in resolution.

```ts
const container = new ObjectFit(img, {
  width: 400, height: 400,
  mode: "scale-down",
});
```

### Comparison Table

| Mode | Preserves Aspect Ratio | May Clip | May Letterbox | May Distort |
|------|----------------------|----------|---------------|-------------|
| `cover` | Yes | Yes | No | No |
| `contain` | Yes | No | Yes | No |
| `fill` | No | No | No | Yes |
| `none` | Yes | Yes | Yes | No |
| `scale-down` | Yes | Possible | Possible | No |

### Export/Import

Lets suppose we have an async function called `draw` that loads a remote image, applies it to a `contained` `100x100` container and returns the canvas:

```ts
import * as fabric from "fabric";
import { setup } from "fabricjs-object-fit";

// if you are using the UMD version
// const { setup } = window.FabricJSObjectFit;

const { ObjectFit } = setup(fabric);

async function draw() {
  const canvas = new fabric.Canvas("c");

  const img = await fabric.FabricImage.fromURL("...");

  const container = new ObjectFit(img, {
    width: 100,
    height: 100,
    mode: "contain"
  });

  canvas.add(container);

  canvas.renderAll();

  return canvas;
}
```

Now we can call `canvas.toJSON` and `canvas.loadFromJSON`:

```ts
const canvas = await draw();

// exporting the canvas data
const exportedData = canvas.toJSON();
console.log(JSON.stringify(exportedData));

// loading the canvas data
const canvas2 = new fabric.Canvas("c2");
await canvas2.loadFromJSON(exportedData);
canvas2.renderAll();
```

> If you can't load the exported data, remember to call `setup(fabric)` before the `loadFromJSON` (on the same context) even if you don't use the returned `ObjectFit` class. This registers the `ObjectFit` type in fabric's `classRegistry`, which is needed for deserialization.

## Object Transform Behavior

When an object already has transforms (position, rotation, scale) before being wrapped in an ObjectFit container, the `useObjectTransform` option controls whether those transforms are preserved on the container or discarded.

By default, `useObjectTransform` is `true` and the container inherits the object's position. The library automatically normalizes coordinates from Fabric.js v7's default `center/center` origin to its internal `left/top` origin, so the container always appears at the correct visual position. Set it to `false` when you want to discard the object's transforms and control placement yourself.

Read the full explanation in [Understanding useObjectTransform](/guide/use-object-transform).

## Fabric.js Version Compatibility

This library requires **Fabric.js v7+** and was built specifically for the v7 API. If you are migrating from an older Fabric.js version, see [Fabric.js Compatibility](/guide/fabricjs-compatibility) for a detailed breakdown of breaking changes from v4 through v7 and how this library handles them.

## Examples

You can take a look at some of ours [examples](/examples/).

## API Documentation

Browse the [API documentation](/api/).

## Contributing

The source code is freely available in our [GitHub Repository](https://github.com/guesant/fabricjs-object-fit). Contributions are welcome.

## License

- [LGPL](https://www.gnu.org/licenses/lgpl-3.0.html) &copy; [Gabriel R. Antunes](https://github.com/guesant), 2022.
