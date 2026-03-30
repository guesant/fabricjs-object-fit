# fabricjs-object-fit

[![Check](https://img.shields.io/github/actions/workflow/status/guesant/fabricjs-object-fit/check.yml?branch=dev&style=for-the-badge&logo=github&label=Check)](https://github.com/guesant/fabricjs-object-fit/actions/workflows/check.yml)
[![Deploy Docs](https://img.shields.io/github/actions/workflow/status/guesant/fabricjs-object-fit/deploy-docs.yml?branch=dev&style=for-the-badge&logo=github-pages&label=Docs)](https://github.com/guesant/fabricjs-object-fit/actions/workflows/deploy-docs.yml)
[![Dependabot](https://img.shields.io/badge/Dependabot-enabled-025e8c?style=for-the-badge&logo=dependabot)](https://github.com/guesant/fabricjs-object-fit/security/dependabot)
[![CodeQL](https://img.shields.io/badge/CodeQL-enabled-3b82f6?style=for-the-badge&logo=github)](https://github.com/guesant/fabricjs-object-fit/security/code-scanning)
[![GitHub stars](https://img.shields.io/github/stars/guesant/fabricjs-object-fit?style=for-the-badge&logo=github)](https://github.com/guesant/fabricjs-object-fit/stargazers)
[![GitHub license](https://img.shields.io/github/license/guesant/fabricjs-object-fit?style=for-the-badge)](https://github.com/guesant/fabricjs-object-fit/blob/dev/LICENSE)
[![npm version](https://img.shields.io/npm/v/fabricjs-object-fit?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/fabricjs-object-fit)

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
