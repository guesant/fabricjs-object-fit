import { randInt } from "./rand-int";

export const randItem = (arr) => arr[randInt(0, arr.length)];
