---
title: Examples
---

::: tip
Each example has a "Source Code" link to the full implementation. You can also open the sandbox in a new tab for a better editing experience.
:::

## Fit Modes

This example creates five canvases, one for each fit mode (`cover`, `contain`, `fill`, `none`, `scale-down`). A 640×160 placeholder image is placed inside a container smaller than the image. The red border shows the container boundary. Notice how each mode handles the mismatch between the image's aspect ratio and the container's differently.

[Source Code](https://github.com/guesant/fabricjs-object-fit/tree/dev/demos/fit-modes).

[![Edit example-fit-modes](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/guesant/fabricjs-object-fit/tree/dev/demos/fit-modes?autoresize=1&fontsize=14&module=%2Fmain.js&theme=dark)

<iframe src="https://codesandbox.io/embed/github/guesant/fabricjs-object-fit/tree/dev/demos/fit-modes?autoresize=1&fontsize=14&module=%2Fmain.js&theme=dark"
  style="width:100%; height:650px; border:0; border-radius: 4px; overflow:hidden;"
  title="example-fit-modes"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Positions

This example demonstrates `object-position` behavior. The same image is placed inside containers using different position values: pixel offsets, percentages, and named anchors like `left`, `center`, `right`. Watch how the image shifts within the container boundary as the position type changes.

[Source Code](https://github.com/guesant/fabricjs-object-fit/tree/dev/demos/position).

[![Edit example-position](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/guesant/fabricjs-object-fit/tree/dev/demos/position?autoresize=1&fontsize=14&module=%2Fmain.js&theme=dark)

<iframe src="https://codesandbox.io/embed/github/guesant/fabricjs-object-fit/tree/dev/demos/position?autoresize=1&fontsize=14&module=%2Fmain.js&theme=dark"
  style="width:100%; height:650px; border:0; border-radius: 4px; overflow:hidden;"
  title="example-position"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Fuzzer

The fuzzer randomly generates combinations of fit modes, container sizes, image sizes, and position values. It is useful for visually verifying that the library handles edge cases correctly. Each refresh produces a new random configuration.

[Source Code](https://github.com/guesant/fabricjs-object-fit/tree/dev/demos/fuzzer).

[![Edit example-fuzzer](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/guesant/fabricjs-object-fit/tree/dev/demos/fuzzer?autoresize=1&fontsize=14&module=%2FApp.svelte&theme=dark)

<iframe src="https://codesandbox.io/embed/github/guesant/fabricjs-object-fit/tree/dev/demos/fuzzer?autoresize=1&fontsize=14&module=%2FApp.svelte&theme=dark"
  style="width:100%; height:650px; border:0; border-radius: 4px; overflow:hidden;"
  title="example-fuzzer"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
