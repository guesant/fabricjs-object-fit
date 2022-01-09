import { fromTag } from "./fromTag";
import { Tag } from "../enums/Tag";

test(fromTag.name, () => {
  expect(fromTag(Tag.START).getAbsolute(50, 100)).toBe(-0);
  expect(fromTag(Tag.START).getAbsolute(100, 50)).toBe(0);

  expect(fromTag(Tag.CENTER).getAbsolute(50, 100)).toBe(-25);
  expect(fromTag(Tag.CENTER).getAbsolute(100, 50)).toBe(25);

  expect(fromTag(Tag.END).getAbsolute(50, 100)).toBe(-50);
  expect(fromTag(Tag.END).getAbsolute(100, 50)).toBe(50);
});
