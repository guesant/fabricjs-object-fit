<script>
  import * as fabric from "fabric";
  import { createObjectFitClass, FitMode } from "fabricjs-object-fit";
  import Controls from "./components/Controls.svelte";
  import { extractContainerInfo } from "./utils/extractContainerInfo.js";
  import { makePoint } from "./utils/makePoint.js";

  const ObjectFit = createObjectFitClass(fabric);

  let canvasEl;
  let canvas;
  let container;

  let mode = $state("cover");
  let containerWidth = $state(400);
  let containerHeight = $state(300);
  let posXType = $state("tag");
  let posXValue = $state("center");
  let posYType = $state("tag");
  let posYValue = $state("center");
  let useObjectTransform = $state(true);
  let imageSrc = $state("https://placehold.co/20x20/3b82f6/fff?text=20x20");
  let containerInfo = $state("{}");
  let loading = $state(false);

  function drawBorder() {
    if (!canvas || !container) return;
    const ctx = canvas.getElement().getContext("2d");
    const bounds = container.getBoundingRect();
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
    ctx.restore();
  }

  function updateInfo() {
    if (!container) return;
    containerInfo = JSON.stringify(extractContainerInfo(container), null, 2);
  }

  function recompute() {
    if (!container) return;
    container.mode = mode;
    container.width = containerWidth;
    container.height = containerHeight;
    container.position.x = makePoint(posXType, posXValue);
    container.position.y = makePoint(posYType, posYValue);
    container.recompute();
    updateInfo();
    canvas?.requestRenderAll();
  }

  async function loadImage() {
    if (!canvas || !imageSrc) return;

    loading = true;

    try {
      const img = await fabric.FabricImage.fromURL(imageSrc, {}, {
        crossOrigin: "anonymous",
      });
      img.set({ originX: "left", originY: "top", top: 0, left: 0 });

      if (container) {
        canvas.remove(container);
      }

      container = new ObjectFit(img, {
        width: containerWidth,
        height: containerHeight,
        mode,
        useObjectTransform,
        position: {
          x: makePoint(posXType, posXValue),
          y: makePoint(posYType, posYValue),
        },
      });

      canvas.add(container);
      canvas.centerObject(container);
      container.setCoords();
      updateInfo();
      canvas.requestRenderAll();
    } catch (err) {
      console.error("Failed to load image:", err);
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    if (!canvasEl) return;

    canvas = new fabric.Canvas(canvasEl, {
      width: 860,
      height: 500,
      backgroundColor: "#f0f0f0",
    });

    canvas.on("after:render", drawBorder);

    loadImage();

    return () => {
      canvas.off("after:render", drawBorder);
      canvas.dispose();
    };
  });

  $effect(() => {
    // track reactive values
    mode;
    containerWidth;
    containerHeight;
    posXType;
    posXValue;
    posYType;
    posYValue;

    recompute();
  });
</script>

<main>
  <h1>fabricjs-object-fit playground</h1>

  <div class="layout">
    <div class="canvas-area">
      <canvas bind:this={canvasEl}></canvas>
      {#if loading}
        <div class="loading">Loading image...</div>
      {/if}
    </div>

    <div class="sidebar">
      <Controls
        bind:mode
        bind:containerWidth
        bind:containerHeight
        bind:posXType
        bind:posXValue
        bind:posYType
        bind:posYValue
        bind:useObjectTransform
        bind:imageSrc
        onLoadImage={loadImage}
      />

      <fieldset class="preview">
        <legend>Container Info</legend>
        <textarea readonly rows="16" value={containerInfo}></textarea>
      </fieldset>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 16px;
    font-family: system-ui, -apple-system, sans-serif;
    background: #fafafa;
  }

  h1 {
    margin: 0 0 16px;
    font-size: 20px;
    font-weight: 600;
  }

  main {
    max-width: 1200px;
  }

  .layout {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .canvas-area {
    position: relative;
    flex-shrink: 0;
  }

  .canvas-area canvas {
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .loading {
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 13px;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 280px;
    max-height: 520px;
    overflow-y: auto;
  }

  .preview {
    margin: 0;
    padding: 8px;
  }

  .preview textarea {
    width: 100%;
    box-sizing: border-box;
    font-family: monospace;
    font-size: 12px;
    resize: vertical;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 6px;
    background: #fff;
  }
</style>
