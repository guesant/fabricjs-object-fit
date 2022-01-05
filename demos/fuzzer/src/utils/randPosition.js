import { randInt } from "./randInt";
import { randItem } from "./randItem";

const {
  FabricJSObjectFit: { Point, Tag }
} = window;

export const randPosition = (axis) => {
  const modes = [];

  const kTag = Symbol("tag");
  const kPer = Symbol("per");
  const kAbs = Symbol("abs");

  if (axis.tags.length > 0) {
    modes.push(kTag);
  }

  if (axis.percentage.enabled) {
    modes.push(kPer);
  }

  if (axis.absolute.enabled) {
    modes.push(kAbs);
  }

  if (modes.length > 0) {
    const mode = randItem(modes);

    switch (mode) {
      case kTag: {
        return Point.fromTag(randItem(axis.tags));
      }

      case kPer: {
        return Point.fromPercentage(
          randInt(axis.percentage.min, axis.percentage.max)
        );
      }
      case kAbs: {
        return Point.fromAbsolute(
          randInt(axis.absolute.min, axis.absolute.max)
        );
      }

      default:
        break;
    }
  }

  return Point.fromTag(Tag.CENTER);
};
