import { ALL_MODES } from "./all-modes";
import { ALL_POSITION_TAGS } from "./all-position-tags";

export const getDefaultData = () => ({
  interval: 900,

  canvas: {
    width: 400,
    height: 250
  },

  modes: ALL_MODES,

  width: {
    min: 100,
    max: 360
  },

  height: {
    min: 100,
    max: 210
  },

  position: {
    x: {
      tags: Object.keys(ALL_POSITION_TAGS),
      percentage: {
        enabled: true,
        min: 0,
        max: 100
      },
      absolute: {
        enabled: true,
        min: 0,
        max: 100
      }
    },
    y: {
      tags: Object.keys(ALL_POSITION_TAGS),
      percentage: {
        enabled: true,
        min: 0,
        max: 100
      },
      absolute: {
        enabled: true,
        min: 0,
        max: 100
      }
    }
  }
});
