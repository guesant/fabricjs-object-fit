import { fromAbsolute } from "./fromAbsolute";

test(fromAbsolute.name, () => {
  expect(fromAbsolute(30).getAbsolute(50, 50)).toBe(30);
  expect(fromAbsolute(20).getAbsolute(50, 100)).toBe(20);
  expect(fromAbsolute(10).getAbsolute(100, 50)).toBe(10);
});
