<script>
  import { ALL_MODES } from "../consts/ALL_MODES";
  import { ALL_POSITION_TAGS } from "../consts/ALL_POSITION_TAGS";
  import { ALL_SIZE_KEYS } from "../consts/ALL_SIZE_KEYS";

  export let data;

  const toggleMode = (mode) => {
    data.modes = data.modes.includes(mode)
      ? data.modes.filter((i) => i !== mode)
      : [...data.modes, mode];
  };

  const togglePositionTag = (axis, tag) => {
    data.position[axis].tags = data.position[axis].tags.includes(tag)
      ? data.position[axis].tags.filter((i) => i !== tag)
      : [...data.position[axis].tags, tag];
  };
</script>

<fieldset>
  <legend>Data</legend>

  <form on:submit={(e) => e.preventDefault()}>
    <div>
      <fieldset>
        <legend>canvas</legend>
        <label>
          width:
          <input
            min="0"
            class="size"
            type="number"
            bind:value={data.canvas.width}
          />
        </label>

        <label>
          height:
          <input
            min="0"
            class="size"
            type="number"
            bind:value={data.canvas.height}
          />
        </label>
      </fieldset>
      <fieldset>
        <legend>Modes</legend>

        {#each ALL_MODES as mode}
          <label>
            <input
              type="checkbox"
              checked={data.modes.includes(mode)}
              on:click={() => toggleMode(mode)}
            />
            {mode}
          </label>
        {/each}
      </fieldset>

      <fieldset>
        <legend>Container Size</legend>
        {#each ALL_SIZE_KEYS as key}
          <fieldset>
            <legend>{key}</legend>

            <div>
              <label>
                min:
                <input
                  min="0"
                  required
                  class="size"
                  type="number"
                  bind:value={data[key].min}
                />
              </label>

              <label>
                max:
                <input
                  required
                  class="size"
                  type="number"
                  min={data[key].min}
                  bind:value={data[key].max}
                />
              </label>
            </div>
          </fieldset>
        {/each}
      </fieldset>

      <fieldset>
        <legend>Position</legend>

        {#each ["x", "y"] as axis}
          <fieldset>
            <legend>{axis} axis</legend>

            <fieldset>
              <legend>Tag</legend>

              {#each Object.entries(ALL_POSITION_TAGS) as tagInfo}
                <label>
                  <input
                    type="checkbox"
                    on:change={() => togglePositionTag(axis, tagInfo[0])}
                    checked={data.position[axis].tags.includes(tagInfo[0])}
                  />
                  {tagInfo[1]}</label
                >
              {/each}
            </fieldset>

            <fieldset>
              <legend>Percentage</legend>

              <div style="margin: 12px 0">
                <label>
                  <input
                    type="checkbox"
                    bind:checked={data.position[axis].percentage.enabled}
                  />
                  Enabled
                </label>
                <span> | </span>
                <label>
                  min:
                  <input
                    min="0"
                    required
                    class="size"
                    type="number"
                    disabled={!data.position[axis].percentage.enabled}
                    bind:value={data.position[axis].percentage.min}
                  />
                </label>
                <label
                  >max:
                  <input
                    required
                    class="size"
                    type="number"
                    min={data.position[axis].percentage.min}
                    disabled={!data.position[axis].percentage.enabled}
                    bind:value={data.position[axis].percentage.max}
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>Absolute</legend>

              <div style="margin: 12px 0">
                <label>
                  <input
                    type="checkbox"
                    bind:checked={data.position[axis].absolute.enabled}
                  />
                  Enable
                </label>
                <span> | </span>
                <label>
                  min:
                  <input
                    min="0"
                    required
                    class="size"
                    type="number"
                    disabled={!data.position[axis].absolute.enabled}
                    bind:value={data.position[axis].absolute.min}
                  />
                </label>
                <label>
                  max:
                  <input
                    required
                    disabled={!data.position[axis].absolute.enabled}
                    bind:value={data.position[axis].absolute.max}
                    class="size"
                    type="number"
                    min={data.position[axis].absolute.min}
                  />
                </label>
              </div>
            </fieldset>
          </fieldset>
        {/each}
      </fieldset>
    </div>
  </form>
</fieldset>

<style>
  fieldset {
    margin: 12px 8px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  input.size {
    max-width: 5em;
  }
</style>
