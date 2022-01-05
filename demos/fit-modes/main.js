{
  const {
    fabric,
    FabricJSObjectFit: { setup }
  } = window;

  const { ObjectFit } = setup(fabric);

  // canvas size
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 200;

  // container size (with a padding of 30px for both sides)
  const CONTAINER_WIDTH = CANVAS_WIDTH - 2 * 30;
  const CONTAINER_HEIGHT = CANVAS_HEIGHT - 2 * 30;

  const MODES = ["cover", "contain", "fill", "none", "scale-down"];
  const BORDER_WIDTH = 3;

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
}
