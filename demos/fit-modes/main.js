import * as fabric from "fabric";
import { createObjectFitClass } from "fabricjs-object-fit";

const ObjectFit = createObjectFitClass(fabric);

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 200;

const CONTAINER_BORDER_WIDTH = 3;
const CONTAINER_BORDER_STYLE = "red";
const CONTAINER_WIDTH = CANVAS_WIDTH - 2 * 30;
const CONTAINER_HEIGHT = CANVAS_HEIGHT - 2 * 30;

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 160;
const IMAGE_SRC = `https://placehold.co/${IMAGE_WIDTH}x${IMAGE_HEIGHT}`;

const MODES = ["cover", "contain", "fill", "none", "scale-down"];

async function main() {
  for (const mode of MODES) {
    const canvasEl = document.getElementById(mode);

    canvasEl.width = CANVAS_WIDTH;
    canvasEl.height = CANVAS_HEIGHT;

    const canvas = new fabric.Canvas(canvasEl);

    const img = await fabric.FabricImage.fromURL(IMAGE_SRC, {
      crossOrigin: "anonymous",
    });

    const container = new ObjectFit(img, {
      mode,
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
    });

    canvas.add(container);
    canvas.centerObject(container);
    container.setCoords();

    // draw borders
    canvas.on("after:render", () => {
      const ctx = canvas.getElement().getContext("2d");
      ctx.lineWidth = CONTAINER_BORDER_WIDTH;
      ctx.strokeStyle = CONTAINER_BORDER_STYLE;

      canvas.forEachObject((obj) => {
        const { left, top, width, height } = obj.getBoundingRect();
        ctx.strokeRect(left + 0.5, top + 0.5, width, height);
      });
    });

    canvas.renderAll();
  }
}

main();
