import { Point, Tag } from "fabricjs-object-fit";

const TAG_MAP = {
  start: Tag.START,
  center: Tag.CENTER,
  end: Tag.END,
};

export function makePoint(type, value) {
  switch (type) {
    case "tag":
      return Point.fromTag(TAG_MAP[value] ?? Tag.CENTER);
    case "percentage":
      return Point.fromPercentage(Number(value));
    case "absolute":
      return Point.fromAbsolute(Number(value));
    case "factor":
      return Point.fromFactor(Number(value));
    default:
      return Point.fromTag(Tag.CENTER);
  }
}
