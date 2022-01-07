import { Tag } from "../enums/Tag";
import { IPoint } from "../types/IPoint";
import { fromTag } from "./fromTag";

const fromAliasedTag = (tag: Tag, ns: string): IPoint => ({
  ...fromTag(tag),
  toString: () => `Point.${ns}`
});

export const X = {
  /**
   * alias for fromTag(Tag.START)
   */
  LEFT: fromAliasedTag(Tag.START, "X.LEFT"),

  /**
   * alias for fromTag(Tag.CENTER)
   */
  CENTER: fromAliasedTag(Tag.CENTER, "X.CENTER"),

  /**
   * alias for fromTag(Tag.END)
   */
  RIGHT: fromAliasedTag(Tag.END, "X.RIGHT")
};

export const Y = {
  /**
   * alias for fromTag(Tag.START)
   */
  TOP: fromAliasedTag(Tag.START, "Y.TOP"),

  /**
   * alias for fromTag(Tag.CENTER)
   */
  CENTER: fromAliasedTag(Tag.CENTER, "Y.CENTER"),

  /**
   * alias for fromTag(Tag.END)
   */
  BOTTOM: fromAliasedTag(Tag.END, "Y.BOTTOM")
};
