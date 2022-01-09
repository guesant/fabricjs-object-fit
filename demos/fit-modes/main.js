{
  const { fabric } = window;
  const { setup } = window.FabricJSObjectFit;

  const { ObjectFit } = setup(fabric);

  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 200;

  const CONTAINER_BORDER_WIDTH = 3;
  const CONTAINER_BORDER_STYLE = "red";
  const CONTAINER_WIDTH = CANVAS_WIDTH - 2 * 30;
  const CONTAINER_HEIGHT = CANVAS_HEIGHT - 2 * 30;

  const IMAGE_WIDTH = 640;
  const IMAGE_HEIGHT = 160;
  const IMAGE_SRC = `https://via.placeholder.com/${IMAGE_WIDTH}x${IMAGE_HEIGHT}`;

  const MODES = ["cover", "contain", "fill", "none", "scale-down"];

  const loadImg = (src, options) =>
    new Promise((resolve) => fabric.Image.fromURL(src, resolve, options));

  async function main() {
    for (const mode of MODES) {
      const canvasEl = document.getElementById(mode);

      canvasEl.width = CANVAS_WIDTH;
      canvasEl.height = CANVAS_HEIGHT;

      const canvas = new fabric.Canvas(canvasEl);

      const img = await loadImg(IMAGE_SRC, {
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

      // draw borders
      canvas.on("after:render", () => {
        canvas.contextContainer.lineWidth = CONTAINER_BORDER_WIDTH;
        canvas.contextContainer.strokeStyle = CONTAINER_BORDER_STYLE;

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
