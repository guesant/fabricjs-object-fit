import { Tag } from "..";

export type IPointSerialized =
  | {
      type: "fromAbsolute";
      args: [number];
    }
  | {
      type: "fromFactor";
      args: [number];
    }
  | {
      type: "fromPercentage";
      args: [string | number];
    }
  | {
      type: "fromTag";
      args: [Tag];
    };
