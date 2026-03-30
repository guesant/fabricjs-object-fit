import * as fabric from "fabric";

export const loadImg = (src, options) =>
  fabric.FabricImage.fromURL(src, { crossOrigin: "anonymous" }).then((img) => {
    img.set(options);
    return img;
  });
