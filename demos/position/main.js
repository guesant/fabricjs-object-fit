const {
  fabric,
  FabricJSObjectFit: { setup, Point, Tag }
} = window;

const { ObjectFit } = setup(fabric);

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 200;

// padding of 30px
const CONTAINER_WIDTH = CANVAS_WIDTH - 2 * 30;
const CONTAINER_HEIGHT = CANVAS_HEIGHT - 2 * 30;

const FIT_MODE = "scale-down";

const MODES = [
  {
    canvasSelector: "#absolute",
    position: {
      x: Point.fromAbsolute(10),
      y: Point.fromAbsolute(10)
    }
  },
  {
    canvasSelector: "#percentage",
    position: {
      x: Point.fromPercentage("50%"),
      y: Point.fromPercentage("75%")
    }
  },
  {
    canvasSelector: "#aliased",
    position: {
      x: Point.X.RIGHT,
      y: Point.Y.CENTER
    }
  },
  {
    canvasSelector: "#tagged",
    position: {
      x: Point.fromTag(Tag.CENTER),
      y: Point.fromTag(Tag.END)
    }
  },
  {
    canvasSelector: "#factor",
    position: {
      x: Point.fromFactor(0.5),
      y: Point.fromFactor(1)
    }
  }
];

const BORDER_WIDTH = 3;

const loadImg = (src, options) =>
  new Promise((resolve) => fabric.Image.fromURL(src, resolve, options));

async function main() {
  for (const { canvasSelector, position } of MODES) {
    const canvasEl = document.querySelector(canvasSelector);

    canvasEl.width = CANVAS_WIDTH;
    canvasEl.height = CANVAS_HEIGHT;

    const canvas = new fabric.Canvas(canvasEl);

    const img = await loadImg("https://via.placeholder.com/300x200", {
      originX: "center",
      originY: "center",
      top: CANVAS_HEIGHT / 2,
      left: CANVAS_WIDTH / 2
    });

    const container = new ObjectFit(img, {
      position,
      mode: FIT_MODE,
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT
    });

    canvas.add(container);

    canvas.on("after:render", () => {
      canvas.contextContainer.lineWidth = BORDER_WIDTH;
      canvas.contextContainer.strokeStyle = "red";
      canvas.forEachObject((obj) => {
        const { left, top, width, height } = obj.getBoundingRect();
        canvas.contextContainer.strokeRect(
          left + 0.5,
          top + 0.5,
          width,
          height
        );
      });
    });

    canvas.renderAll();
  }
}

main();
