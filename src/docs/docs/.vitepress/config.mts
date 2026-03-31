import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";

export default defineConfig({
  title: "fabricjs-object-fit",
  description:
    "CSS-like 'object-fit' and 'object-position' behavior for FabricJS.",

  base: process.env.BASE ?? "/",

  vite: {
    plugins: [
      {
        name: "escape-typedoc-html",
        enforce: "pre",
        transform(code, id) {
          if (!id.endsWith(".md") || !id.includes("/api/")) return;

          // Escape raw HTML tags in typedoc-generated prose that cause Vue
          // compiler errors (e.g. "<canvas>" missing end tag).
          // Preserves content inside backtick spans and fenced code blocks.
          const blocks: string[] = [];
          const ph = "\0CODEBLOCK\0";
          let result = code.replace(/(```[\s\S]*?```|`[^`]*?`)/g, (m) => {
            blocks.push(m);
            return ph;
          });
          // Escape bare HTML element tags that are not markup
          result = result.replace(/<(\/?)(canvas|slot|template)(\s|>)/gi, "\\<$1$2$3");
          result = result.replace(new RegExp(ph.replace(/\0/g, "\\0"), "g"), () => blocks.shift()!);
          return result;
        },
      },
    ],
  },

  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
      { text: "Examples", link: "/examples/" },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/guesant/fabricjs-object-fit",
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "What is fabricjs-object-fit?", link: "/guide/#what-is-fabricjs-object-fit" },
            { text: "Install", link: "/guide/#install" },
            { text: "Usage", link: "/guide/#usage" },
            { text: "Fit Modes Explained", link: "/guide/#fit-modes-explained" },
            { text: "Export/Import", link: "/guide/#export-import" },
            { text: "Examples", link: "/guide/#examples" },
            { text: "API Documentation", link: "/guide/#api-documentation" },
            { text: "Contributing", link: "/guide/#contributing" },
            { text: "License", link: "/guide/#license" },
          ],
        },
        {
          text: "Deep Dives",
          items: [
            { text: "useObjectTransform", link: "/guide/use-object-transform" },
            { text: "Fabric.js Compatibility", link: "/guide/fabricjs-compatibility" },
          ],
        },
      ],
      "/examples/": [
        {
          text: "Examples",
          items: [
            { text: "Fit Modes", link: "/examples/#fit-modes" },
            { text: "Positions", link: "/examples/#positions" },
            { text: "Fuzzer", link: "/examples/#fuzzer" },
          ],
        },
      ],
      "/api/": typedocSidebar,
    },

    search: { provider: "local" },
  },
});
