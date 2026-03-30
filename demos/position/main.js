import * as fabric from "fabric";
import { createObjectFitClass, Point, Tag } from "fabricjs-object-fit";

const ObjectFit = createObjectFitClass(fabric);

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 200;

const CONTAINER_FIT_MODE = "none";
const CONTAINER_BORDER_WIDTH = 3;
const CONTAINER_BORDER_STYLE = "red";
const CONTAINER_WIDTH = CANVAS_WIDTH - 2 * 30;
const CONTAINER_HEIGHT = CANVAS_HEIGHT - 2 * 30;

const IMAGE_WIDTH = CANVAS_WIDTH * 0.5;
const IMAGE_HEIGHT = CANVAS_HEIGHT * 0.5;
const IMAGE_SRC = `https://placehold.co/${IMAGE_WIDTH}x${IMAGE_HEIGHT}`;

const MODES = [
  {
    selector: "#absolute",
    position: {
      x: Point.fromAbsolute(10),
      y: Point.fromAbsolute(10),
    },
  },
  {
    selector: "#percentage",
    position: {
      x: Point.fromPercentage("50%"),
      y: Point.fromPercentage("75%"),
    },
  },
  {
    selector: "#aliased",
    position: {
      x: Point.X.RIGHT,
      y: Point.Y.TOP,
    },
  },
  {
    selector: "#tagged",
    position: {
      x: Point.fromTag(Tag.START),
      y: Point.fromTag(Tag.END),
    },
  },
  {
    selector: "#factor",
    position: {
      x: Point.fromFactor(0.25),
      y: Point.fromFactor(0.25),
    },
  },
];

async function main() {
  for (const { selector, position } of MODES) {
    const canvasEl = document.querySelector(selector);

    canvasEl.width = CANVAS_WIDTH;
    canvasEl.height = CANVAS_HEIGHT;

    const canvas = new fabric.Canvas(canvasEl);

    const img = await fabric.FabricImage.fromURL(IMAGE_SRC, {
      crossOrigin: "anonymous",
    });

    const container = new ObjectFit(img, {
      position,
      mode: CONTAINER_FIT_MODE,
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
