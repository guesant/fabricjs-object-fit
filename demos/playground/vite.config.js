import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "fabricjs-object-fit": resolve(
        import.meta.dirname,
        "../../src/fabricjs-object-fit/src/index.ts",
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
});
