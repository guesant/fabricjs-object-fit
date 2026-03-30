<script>
  import * as fabric from "fabric";
  import { createObjectFitClass } from "fabricjs-object-fit";
  import { onMount } from "svelte";
  import Data from "./src/components/data.svelte";
  import { getDefaultData } from "./src/consts/get-default-data";
  import { extractContainerInfo } from "./src/utils/extract-container-info";
  import { loadImg } from "./src/utils/load-img";
  import { randInt } from "./src/utils/rand-int";
  import { randItem } from "./src/utils/rand-item";
  import { randPosition } from "./src/utils/rand-position";

  // document elements
  let canvasEl, start, stop, next, previewInfo;

  // fuzzer interval utils
  let fuzzerIntervalId = $state(null);
  let fuzzerInterval = $state(null);

  // fuzzer payload
  let data = $state(getDefaultData());

  const syncCanvas = (canvas) => {
    canvas.setWidth(data.canvas.width);
    canvas.setHeight(data.canvas.height);
    canvas.calcOffset();
  };

  onMount(async () => {
    const ObjectFit = createObjectFitClass(fabric);

    const canvas = new fabric.Canvas(canvasEl);
    syncCanvas(canvas);

    const img = await loadImg("https://placehold.co/180x140", {});

    const container = new ObjectFit(img, {
      mode: "cover",
      width: 300,
      height: 200,
      useObjectTransform: false,
    });

    canvas.add(container);

    // draw borders
    canvas.on("after:render", () => {
      const ctx = canvas.getElement().getContext("2d");
      ctx.lineWidth = 3;
      ctx.strokeStyle = "red";
      canvas.forEachObject((obj) => {
        const { left, top, width, height } = obj.getBoundingRect();
        ctx.strokeRect(left + 0.5, top + 0.5, width, height);
      });
    });

    canvas.renderAll();

    const renderWithRandomData = () => {
      syncCanvas(canvas);

      container.mode = randItem(data.modes);

      container.width = randInt(data.width.min, data.width.max);
      container.height = randInt(data.height.min, data.height.max);

      container.position.x = randPosition(data.position.x);
      container.position.y = randPosition(data.position.y);

      previewInfo.value = JSON.stringify(
        extractContainerInfo(container),
        null,
        2,
      );

      container.recompute();

      canvas.requestRenderAll();
    };

    const stopFuzzer = () => {
      if (fuzzerIntervalId !== null) {
        clearInterval(fuzzerIntervalId);
        fuzzerIntervalId = null;
        fuzzerInterval = null;
      }
    };

    const startFuzzer = () => {
      stopFuzzer();

      fuzzerInterval = data.interval;

      renderWithRandomData();

      fuzzerIntervalId = setInterval(() => {
        if (fuzzerInterval !== data.interval) {
          startFuzzer();
          return;
        }
        renderWithRandomData();
      }, fuzzerInterval);
    };

    stop.addEventListener("click", () => stopFuzzer());
    start.addEventListener("click", () => startFuzzer());
    next.addEventListener("click", () => renderWithRandomData());

    renderWithRandomData();
  });
</script>

<main>
  <h1>Fuzzer</h1>

  <p>
    <a
      href="https://github.com/guesant/fabricjs-object-fit/tree/dev/demos/fuzzer"
    >
      Show me the Source Code
    </a>
  </p>

  <fieldset>
    <legend>Preview</legend>

    <div class="previewWrapper">
      <div>
        <canvas bind:this={canvasEl}></canvas>
      </div>

      <div>
        <div class="previewSetup">
          <div class="intervalContainer">
            <label>
              interval:
              <input
                min="0"
                class="size"
                type="number"
                bind:value={data.interval}
              />
            </label>
            <span> | </span>
            <button disabled={fuzzerIntervalId !== null} bind:this={start}>
              Start
            </button>
            <button disabled={fuzzerIntervalId === null} bind:this={stop}>
              Stop
            </button>
          </div>
          <span>|</span>
          <button bind:this={next}>Generate Next</button>
        </div>
        <textarea class="previewInfo" rows="15" bind:this={previewInfo}
        ></textarea>
      </div>
    </div>
  </fieldset>
  <Data bind:data />
</main>

<style>
  *,
  ::after,
  ::before {
    box-sizing: border-box;
  }

  main {
    max-width: 861px;
    margin: 0 auto;
  }

  fieldset {
    margin: 12px 8px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  input.size {
    max-width: 5em;
  }

  canvas {
    border: 2px solid;
  }

  .previewSetup {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .previewSetup .intervalContainer {
    border: 1px solid rgba(0, 0, 0, 0.25);
    padding: 8px 12px;
  }

  .previewWrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 16px;
    padding: 0 0 8px 0;
  }

  .previewInfo {
    margin-top: 16px;
    border: 2px solid rgba(0, 0, 0, 0.25);
    padding: 8px;
    resize: vertical;
    display: block;

    width: 100%;

    min-height: 180px;
    max-height: 540px;
  }
</style>
