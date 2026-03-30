---
layout: home
hero:
  name: fabricjs-object-fit
  tagline: Control how images and objects fill their containers on the Fabric.js canvas -- just like CSS object-fit.
  text: Drop-in object-fit and object-position behavior for Fabric.js v7+. Cover, contain, fill, scale-down, or display at original size -- without writing scaling math yourself.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View Examples
      link: /examples/
features:
  - title: No Extra Dependencies
    details: Zero runtime dependencies beyond Fabric.js itself. Lightweight and tree-shakeable.
  - title: Five Fit Modes
    details: "Supports cover, contain, fill, scale-down, and none -- the same modes you know from CSS object-fit, applied to any FabricObject."
  - title: Precise Positioning
    details: "Position content inside the container using pixels, percentages, or named anchors (left, center, right, top, bottom) -- just like CSS object-position."
---

## Why fabricjs-object-fit?

Fabric.js has no built-in way to say "fit this image inside a 400×400 box without distortion." In the browser, CSS `object-fit` solves this in one line. This library brings that same mental model to Fabric.js:

- **`cover`** -- fill the container completely, cropping if needed (think hero banners, profile pictures)
- **`contain`** -- fit the entire image inside the container, letterboxing if needed (think product thumbnails)
- **`fill`** -- stretch to match the container exactly (the Fabric.js default behavior)
- **`none`** -- display at the image's original size, clipping anything outside the container
- **`scale-down`** -- like `contain`, but never scales *up* -- only down

The library also handles serialization (`toJSON` / `loadFromJSON`), so your object-fit containers round-trip through Fabric.js save/load without extra work.
