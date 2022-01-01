import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

const sharedPlugins = [nodeResolve()];

export default defineConfig([
  {
    input: "./src/index.ts",
    output: [
      {
        sourcemap: true,
        file: "lib/index.js",
        format: "cjs",
      },
      {
        sourcemap: true,
        file: "lib/index.mjs",
        format: "es",
      },
    ],
    plugins: [...sharedPlugins, typescript({ tsconfig: "./tsconfig.json" })],
  },
  {
    input: "./src/index.ts",
    output: [
      {
        file: "lib/index.d.ts",
        format: "es",
      },
    ],
    plugins: [...sharedPlugins, dts()],
  },
]);
