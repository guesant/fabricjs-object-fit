import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

const sharedPluginsPre = [nodeResolve()];
const minifyPlugins = [terser()];

export default defineConfig([
  {
    input: "./src/index.ts",
    output: [
      {
        sourcemap: true,
        file: "lib/index.js",
        format: "cjs"
      },
      {
        sourcemap: true,
        file: "lib/index.mjs",
        format: "esm"
      },
      {
        sourcemap: true,
        name: "FabricJSObjectFit",
        file: "lib/index.umd.js",
        format: "umd",
        plugins: [...minifyPlugins]
      }
    ],
    plugins: [
      ...sharedPluginsPre,
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({
        babelHelpers: "bundled",
        extensions: [".ts"],
        include: "src/**/*.ts"
      })
    ]
  },
  {
    input: "./src/index.ts",
    output: [
      {
        file: "lib/index.d.ts",
        format: "es"
      }
    ],
    plugins: [...sharedPluginsPre, dts()]
  }
]);
