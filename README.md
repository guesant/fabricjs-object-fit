# fabricjs-object-fit

[![Check](https://img.shields.io/github/actions/workflow/status/guesant/fabricjs-object-fit/check.yml?branch=dev&logo=github&label=Check&labelColor=black)](https://github.com/guesant/fabricjs-object-fit/actions/workflows/check.yml)
[![Deploy Docs](https://img.shields.io/github/actions/workflow/status/guesant/fabricjs-object-fit/deploy-docs.yml?branch=dev&logo=github-pages&label=Docs&labelColor=black)](https://github.com/guesant/fabricjs-object-fit/actions/workflows/deploy-docs.yml)
[![Dependabot](https://img.shields.io/badge/Dependabot-enabled-025e8c?logo=dependabot&labelColor=black)](https://github.com/guesant/fabricjs-object-fit/security/dependabot)
[![CodeQL](https://img.shields.io/badge/CodeQL-enabled-3b82f6?logo=github&labelColor=black)](https://github.com/guesant/fabricjs-object-fit/security/code-scanning)
[![GitHub stars](https://img.shields.io/github/stars/guesant/fabricjs-object-fit?logo=github&labelColor=black)](https://github.com/guesant/fabricjs-object-fit/stargazers)
[![GitHub license](https://img.shields.io/github/license/guesant/fabricjs-object-fit?labelColor=black)](https://github.com/guesant/fabricjs-object-fit/blob/dev/LICENSE)
[![npm version](https://img.shields.io/npm/v/fabricjs-object-fit?logo=npm&labelColor=black)](https://www.npmjs.com/package/fabricjs-object-fit)
[![pkg.pr.new](https://pkg.pr.new/badge/guesant/fabricjs-object-fit)](https://pkg.pr.new/guesant/fabricjs-object-fit)

CSS-like `object-fit` and `object-position` behavior for [Fabric.js](http://fabricjs.com/) (v7+).

## What is this?

When you place an image on a Fabric.js canvas, there is no built-in way to say "fit this image inside a 400×400 box without distortion." In the browser, CSS `object-fit` solves this in one property. **fabricjs-object-fit** brings that same behavior to Fabric.js:

- **cover** -- fill the container, crop the overflow
- **contain** -- fit inside the container, letterbox the rest
- **fill** -- stretch to match exactly
- **none** -- display at original size, clip overflow
- **scale-down** -- like contain, but never scales up

It also supports `object-position` (pixel, percentage, or named anchors) and round-trips through Fabric.js serialization (`toJSON` / `loadFromJSON`).

## Quick Start

```bash
pnpm add fabricjs-object-fit fabric
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
