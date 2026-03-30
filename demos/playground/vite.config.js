import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "node:path";

const src = resolve(import.meta.dirname, "../../src");

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      fabric: resolve(src, "node_modules/fabric"),
      "fabricjs-object-fit": resolve(
        src,
        "fabricjs-object-fit/src/index.ts",
      ),
    },
  },
  server: {
    port: 3001,
    open: true,
    fs: {
      allow: ["../.."],
    },
  },
  optimizeDeps: {
    include: ["fabric"],
  },
});
