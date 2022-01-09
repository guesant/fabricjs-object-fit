---
title: Guide
sidebar: auto
---

## Install

### From NPM

```bash
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
import { fabric } from "fabric";
import { setup } from "fabricjs-object-fit";

// if you are using the UMD version
// const { setup } = window.FabricJSObjectFit;

const { ObjectFit } = setup(fabric);

async function doRender() {
  const canvas = new fabric.Canvas("c");

  const img = await new Promise((resolve) =>
    fabric.Image.fromURL("https://via.placeholder.com/640x360", resolve)
  );

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

- Changing the container image to another with diffrent dimensions

```ts
fabric.Image.fromURL("...", (img2) => {
  container.setObject(img2);
  container.recompute();
  canvas.requestRenderAll();
});
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

In the CSS we have the syntax `object-position: size-for-x-axis size-for-y-axis`. In this library we are going to declare the `size-for-?-axis` with the [`Point`](/api/modules/Point.html) API.

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

Take a look at [`Point`](/api/modules/Point.html) on the API docs.

### Export/Import

Lets suppose we have an async function called `draw` that loads an remote image, applies then to a `contained` `100x100` container and returns the canvas:

```ts
import { fabric } from "fabric";
import { setup } from "fabricjs-object-fit";

// if you are using the UMD version
// const { setup } = window.FabricJSObjectFit;

const { ObjectFit } = setup(fabric);

async function draw() {
  const canvas = new fabric.Canvas("c");

  const img = await new Promise((resolve) =>
    fabric.Image.fromURL("...", resolve)
  );

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
draw().then((canvas) => {
  // exporting the canvas data
  const exportedData = canvas.toJSON();
  console.log(JSON.stringify(exportedData));

  // loading the canvas data
  const canvas2 = new fabric.Canvas("c2");
  canvas2.loadFromJSON(exportedData, () => {
    canvas2.renderAll();
  });
});
```

> If you can't load the exported data, remember to call `setup(fabric)` before the `loadFromJSON` (on the same context) even if you dont use the returned `ObjectFit` class.

## Examples

You can take a look at some of ours [examples](/examples/).

## API Documentation

Browse the [API documentation](/api/index.html) 🚀.

## Contributting

The source code is freely avaliable in our [GitHub Repository](https://github.com/guesant/fabricjs-object-fit). Contributtions are welcome.

## License

- [LGPL](https://www.gnu.org/licenses/lgpl-3.0.html) © [Gabriel R. Antunes](https://github.com/guesant), 2022.
