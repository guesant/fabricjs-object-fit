const {
  fabric,
  FabricJSObjectFit: { setup }
} = window;

const { ObjectFit } = setup(fabric);

// canvas size
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

// container size (with a padding of 30px for both sides)
const CONTAINER_WIDTH = CANVAS_WIDTH - 2 * 30;
const CONTAINER_HEIGHT = CANVAS_HEIGHT - 2 * 30;

const MODES = ["cover", "contain", "fill", "none", "scale-down"];

const loadImg = (src, options) =>
  new Promise((resolve) => fabric.Image.fromURL(src, resolve, options));

async function main() {
  for (const mode of MODES) {
    const canvasEl = document.getElementById(mode);

    canvasEl.width = CANVAS_WIDTH;
    canvasEl.height = CANVAS_HEIGHT;

    const canvas = new fabric.Canvas(canvasEl);

    const img = await loadImg("https://via.placeholder.com/640x360", {
      originX: "center",
      originY: "center",
      top: CANVAS_HEIGHT / 2,
      left: CANVAS_WIDTH / 2
    });

    const container = new ObjectFit(img, {
      mode,
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT
    });

    container.borderColor = "red";
    container.borderScaleFactor = 3;

    canvas.add(container);

    canvas.renderAll();
  }
}

main();
