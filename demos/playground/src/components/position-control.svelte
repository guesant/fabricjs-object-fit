<script>
  let { label, type = $bindable(), value = $bindable() } = $props();
</script>

<fieldset>
  <legend>Position {label}</legend>

  <label>
    Type:
    <select bind:value={type}>
      <option value="tag">Tag</option>
      <option value="percentage">Percentage</option>
      <option value="absolute">Absolute</option>
      <option value="factor">Factor</option>
    </select>
  </label>

  {#if type === "tag"}
    <label>
      Value:
      <select bind:value>
        <option value="start">START</option>
        <option value="center">CENTER</option>
        <option value="end">END</option>
      </select>
    </label>
  {:else if type === "percentage"}
    <label>
      Value (%):
      <input type="number" bind:value min="0" max="100" step="1" />
    </label>
    <input type="range" bind:value min="0" max="100" step="1" />
  {:else if type === "absolute"}
    <label>
      Value (px):
      <input type="number" bind:value step="1" />
    </label>
  {:else if type === "factor"}
    <label>
      Value (0-1):
      <input type="number" bind:value min="0" max="1" step="0.01" />
    </label>
    <input type="range" bind:value min="0" max="1" step="0.01" />
  {/if}
</fieldset>

<style>
  fieldset {
    margin: 0 0 8px;
    padding: 8px;
  }
  label {
    display: block;
    margin: 4px 0;
  }
  select,
  input[type="number"] {
    max-width: 120px;
  }
  input[type="range"] {
    width: 100%;
  }
</style>
