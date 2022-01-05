import { Tag } from "../enums/Tag";
import { IPoint } from "../types/IPoint";
import { fromFactor } from "./fromFactor";

const factors = { [Tag.START]: 0, [Tag.CENTER]: 0.5, [Tag.END]: 1 };

const tagString = {
  [Tag.START]: "Tag.START",
  [Tag.CENTER]: "Tag.CENTER",
  [Tag.END]: "Tag.END"
};

/**
 * @param tag can be Tag.START, Tag.CENTER or Tag.END
 * @returns IPoint
 */

export const fromTag = (tag: Tag): IPoint => {
  const factor = factors[tag];
  return {
    ...fromFactor(factor),
    toString: () => `Point.fromTag(${tagString[tag] ?? tag})`,
    toJSON: () => ({
      type: "fromTag",
      args: [tag]
    })
  };
};
