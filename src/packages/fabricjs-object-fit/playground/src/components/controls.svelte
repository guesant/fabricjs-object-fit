<script>
  import PositionControl from "./position-control.svelte";

  let {
    mode = $bindable(),
    containerWidth = $bindable(),
    containerHeight = $bindable(),
    posXType = $bindable(),
    posXValue = $bindable(),
    posYType = $bindable(),
    posYValue = $bindable(),
    useObjectTransform = $bindable(),
    objectOriginX = $bindable(),
    objectOriginY = $bindable(),
    objectLeft = $bindable(),
    objectTop = $bindable(),
    objectAngle = $bindable(),
    objectScaleX = $bindable(),
    objectScaleY = $bindable(),
    imageSrc = $bindable(),
    onLoadImage,
  } = $props();

  const ORIGIN_PRESETS = [
    { label: "left / top", x: "left", y: "top" },
    { label: "center / center", x: "center", y: "center" },
    { label: "right / bottom", x: "right", y: "bottom" },
    { label: "right / top", x: "right", y: "top" },
  ];

  function applyOriginPreset(x, y) {
    objectOriginX = x;
    objectOriginY = y;
    onLoadImage?.();
  }

  let urlInput = $state("");

  const PRESETS = [
    { label: "Landscape", url: "https://placehold.co/600x400/3b82f6/fff?text=600x400" },
    { label: "Portrait", url: "https://placehold.co/300x500/ef4444/fff?text=300x500" },
    { label: "Square", url: "https://placehold.co/400x400/22c55e/fff?text=400x400" },
    { label: "Wide", url: "https://placehold.co/800x200/a855f7/fff?text=800x200" },
  ];

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      imageSrc = reader.result;
      onLoadImage?.();
    };
    reader.readAsDataURL(file);
  }

  function loadUrl() {
    if (!urlInput.trim()) return;
    imageSrc = urlInput.trim();
    onLoadImage?.();
  }

  function loadPreset(url) {
    imageSrc = url;
    onLoadImage?.();
  }
</script>

<div class="controls">
  <fieldset>
    <legend>Fit Mode</legend>
    <select bind:value={mode}>
      <option value="cover">cover</option>
      <option value="contain">contain</option>
      <option value="fill">fill</option>
      <option value="none">none</option>
      <option value="scale-down">scale-down</option>
    </select>
  </fieldset>

  <fieldset>
    <legend>Container Size</legend>
    <label>
      Width:
      <input type="number" bind:value={containerWidth} min="50" max="800" step="10" />
    </label>
    <input type="range" bind:value={containerWidth} min="50" max="800" step="10" />
    <label>
      Height:
      <input type="number" bind:value={containerHeight} min="50" max="800" step="10" />
    </label>
    <input type="range" bind:value={containerHeight} min="50" max="800" step="10" />
  </fieldset>

  <PositionControl label="X" bind:type={posXType} bind:value={posXValue} />
  <PositionControl label="Y" bind:type={posYType} bind:value={posYValue} />

  <fieldset>
    <legend>Object Transform</legend>
    <label>
      <input type="checkbox" bind:checked={useObjectTransform} />
      useObjectTransform
    </label>

    <div class="sub-section">
      <span class="sub-label">Origin presets:</span>
      <div class="presets">
        {#each ORIGIN_PRESETS as { label, x, y }}
          <button
            class:active={objectOriginX === x && objectOriginY === y}
            onclick={() => applyOriginPreset(x, y)}
          >{label}</button>
        {/each}
      </div>
    </div>

    <div class="sub-section">
      <span class="sub-label">Origin:</span>
      <label>
        originX:
        <select bind:value={objectOriginX} onchange={() => onLoadImage?.()}>
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </select>
      </label>
      <label>
        originY:
        <select bind:value={objectOriginY} onchange={() => onLoadImage?.()}>
          <option value="top">top</option>
          <option value="center">center</option>
          <option value="bottom">bottom</option>
        </select>
      </label>
    </div>

    <div class="sub-section">
      <span class="sub-label">Position:</span>
      <label>
        left:
        <input type="number" bind:value={objectLeft} step="10" onchange={() => onLoadImage?.()} />
      </label>
      <label>
        top:
        <input type="number" bind:value={objectTop} step="10" onchange={() => onLoadImage?.()} />
      </label>
    </div>

    <div class="sub-section">
      <span class="sub-label">Scale &amp; Rotation:</span>
      <label>
        scaleX:
        <input type="number" bind:value={objectScaleX} min="0.1" max="5" step="0.1" onchange={() => onLoadImage?.()} />
      </label>
      <label>
        scaleY:
        <input type="number" bind:value={objectScaleY} min="0.1" max="5" step="0.1" onchange={() => onLoadImage?.()} />
      </label>
      <label>
        angle:
        <input type="number" bind:value={objectAngle} min="0" max="360" step="5" onchange={() => onLoadImage?.()} />
      </label>
    </div>
  </fieldset>

  <fieldset>
    <legend>Image Source</legend>
    <div class="presets">
      {#each PRESETS as { label, url }}
        <button onclick={() => loadPreset(url)}>{label}</button>
      {/each}
    </div>
    <label>
      URL:
      <input type="text" bind:value={urlInput} placeholder="https://..." />
      <button onclick={loadUrl}>Load</button>
    </label>
    <label>
      File:
      <input type="file" accept="image/*" onchange={handleFileUpload} />
    </label>
  </fieldset>
</div>

<style>
  .controls {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 280px;
    max-width: 320px;
  }
  fieldset {
    margin: 0 0 8px;
    padding: 8px;
  }
  label {
    display: block;
    margin: 4px 0;
  }
  select,
  input[type="number"],
  input[type="text"] {
    max-width: 140px;
  }
  input[type="range"] {
    width: 100%;
  }
  input[type="text"] {
    width: 100%;
    max-width: none;
    box-sizing: border-box;
  }
  .presets {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 8px;
  }
  .presets button {
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
  }
  .presets button.active {
    background: #3b82f6;
    color: white;
    border-color: #2563eb;
  }
  .sub-section {
    margin-top: 8px;
    padding-top: 6px;
    border-top: 1px solid #e5e7eb;
  }
  .sub-label {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
  }
</style>
