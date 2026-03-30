const { fabric } = window;

export const loadImg = (src, options) =>
  new Promise((resolve) => fabric.Image.fromURL(src, resolve, options));
