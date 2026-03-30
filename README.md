# fabricjs-object-fit

CSS-like `object-fit` and `object-position` behavior for [Fabric.js](http://fabricjs.com/) (v7+).

## Quick Start

```bash
npm install fabricjs-object-fit fabric
```

```ts
import * as fabric from "fabric";
import { setup, Point } from "fabricjs-object-fit";

const { ObjectFit } = setup(fabric);

const canvas = new fabric.Canvas("c");

const img = await fabric.FabricImage.fromURL("https://placehold.co/640x360");

const container = new ObjectFit(img, {
  width: 400,
  height: 400,
  mode: "cover", // "cover" | "contain" | "fill" | "none" | "scale-down"
  position: {
    x: Point.X.CENTER,
    y: Point.Y.CENTER,
  },
});

canvas.add(container);
canvas.renderAll();
```

## Documentation

Read the full [guide](https://guesant.github.io/fabricjs-object-fit/guide/) and browse the [API documentation](https://guesant.github.io/fabricjs-object-fit/api/).

## License

- [LGPL](https://www.gnu.org/licenses/lgpl-3.0.html) &copy; [Gabriel R. Antunes](https://github.com/guesant), 2022.
