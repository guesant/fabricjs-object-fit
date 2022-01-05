import { randInt } from "./randInt";

export const randItem = (arr) => arr[randInt(0, arr.length)];
