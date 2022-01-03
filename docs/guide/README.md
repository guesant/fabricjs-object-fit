---
title: Guide
sidebar: auto
---

## Installation

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

### Browser

#### UMD

```html
<script src="https://unpkg.com/fabricjs-object-fit/lib/index.umd.js"></script>
<script>
  const {} = FabricJSObjectFit;
</script>
```

#### ESModule

```html
<script type="module">
  import {} from "https://unpkg.com/fabricjs-object-fit/lib/index.mjs";
</script>
```

## Usage

- Cover Example

```ts
import { fabric } from "fabric";
import { setup } from "fabricjs-object-fit";

const { ObjectFit } = setup(fabric);

function doRender() {
  const canvas = new fabric.Canvas("c");

  fabric.Image.fromUrl("https://via.placeholder.com/640x360", (img) => {
    const container = new ObjectFit(img, {
      width: 400,
      height: 400,
      mode: "cover"
    });

    canvas.add(container);

    canvas.renderAll();
  });
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

- Changing the container dimensions

```ts
container.width = 300;
container.height = 700;
container.recompute();
canvas.requestRenderAll();
```

- Setting the image position in the container

> Behaviours like CSS's [object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position).

```ts
import { fabric } from "fabric";
import { setup, Point } from "fabricjs-object-fit";
// const { setup, Point } = FabricJSObjectFit;

const { ObjectFit } = setup(fabric);

function doRender() {
  const canvas = new fabric.Canvas("c");

  const container = new ObjectFit(img, {
    width: 100,
    height: 100,
    mode: "none",
    position: {
      x: Point.X.RIGHT,
      y: Point.fromPercentage(100)
    }
  });

  canvas.add(container);

  canvas.renderAll();
}

doRender();
```

### Export/Import

Lets create a function that draws an fitted image and returns the canvas

```ts
import { fabric } from "fabric";
import { setup } from "fabricjs-object-fit";
// const { setup } = FabricJSObjectFit;

const { ObjectFit } = setup(fabric);

async function draw() {
  const canvas = new fabric.Canvas("c");

  const img = await Promise((resolve) => fabric.Image.fromURL("...", resolve));

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

## Examples

You can take a look at some of ours [examples](/examples/).

## API Documentation

Browse the [API documentation](/api/index.html) 🚀.

## Contributting

The source code is freely avaliable in our [GitHub Repository](https://github.com/guesant/fabricjs-object-fit). Contributtions are welcome.

## License

- [LGPL](https://www.gnu.org/licenses/lgpl-3.0.html) © [Gabriel R. Antunes](https://github.com/guesant), 2022.
