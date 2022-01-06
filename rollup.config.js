import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

const sharedPluginsBefore = [nodeResolve()];
const distMinifyPlugins = [terser()];

export default defineConfig([
  {
    input: "./src/index.ts",
    output: [
      {
        format: "cjs",
        sourcemap: true,
        file: "lib/index.js"
      },
      {
        format: "esm",
        sourcemap: true,
        file: "lib/index.mjs"
      },
      {
        format: "umd",
        sourcemap: true,
        file: "lib/index.umd.js",
        name: "FabricJSObjectFit",
        plugins: [...distMinifyPlugins]
      }
    ],
    plugins: [
      ...sharedPluginsBefore,
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({
        extensions: [".ts"],
        include: "src/**/*.ts",
        babelHelpers: "bundled"
      })
    ]
  },
  {
    input: "./src/index.ts",
    output: [
      {
        format: "esm",
        file: "lib/index.d.ts"
      }
    ],
    plugins: [...sharedPluginsBefore, dts()]
  }
]);
