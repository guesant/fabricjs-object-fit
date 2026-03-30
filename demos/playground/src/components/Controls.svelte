<script>
  import PositionControl from "./PositionControl.svelte";

  let {
    mode = $bindable(),
    containerWidth = $bindable(),
    containerHeight = $bindable(),
    posXType = $bindable(),
    posXValue = $bindable(),
    posYType = $bindable(),
    posYValue = $bindable(),
    useObjectTransform = $bindable(),
    imageSrc = $bindable(),
    onLoadImage,
  } = $props();

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
    <legend>Options</legend>
    <label>
      <input type="checkbox" bind:checked={useObjectTransform} />
      useObjectTransform
    </label>
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
</style>
