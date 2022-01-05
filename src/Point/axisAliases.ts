import { Tag } from "../enums/Tag";
import { IPoint } from "../types/IPoint";
import { fromTag } from "./fromTag";

const fromTagAliased = (tag: Tag, ns: string): IPoint => ({
  ...fromTag(tag),
  toString: () => `Point.${ns}`
});

export const X = {
  /**
   * alias for fromTag(Tag.START)
   */
  LEFT: fromTagAliased(Tag.START, "X.LEFT"),

  /**
   * alias for fromTag(Tag.CENTER)
   */
  CENTER: fromTagAliased(Tag.CENTER, "X.CENTER"),

  /**
   * alias for fromTag(Tag.END)
   */
  RIGHT: fromTagAliased(Tag.END, "X.RIGHT")
};

export const Y = {
  /**
   * alias for fromTag(Tag.START)
   */
  TOP: fromTagAliased(Tag.START, "Y.TOP"),

  /**
   * alias for fromTag(Tag.CENTER)
   */
  CENTER: fromTagAliased(Tag.CENTER, "Y.CENTER"),

  /**
   * alias for fromTag(Tag.END)
   */
  BOTTOM: fromTagAliased(Tag.END, "Y.BOTTOM")
};
