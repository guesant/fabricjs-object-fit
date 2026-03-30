import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";

export default defineConfig({
  title: "fabricjs-object-fit",
  description:
    "CSS-like 'object-fit' and 'object-position' behavior for FabricJS.",

  base: process.env.BASE ?? "/",

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
            { text: "Install", link: "/guide/#install" },
            { text: "Usage", link: "/guide/#usage" },
            { text: "Export/Import", link: "/guide/#export-import" },
            { text: "Examples", link: "/guide/#examples" },
            { text: "API Documentation", link: "/guide/#api-documentation" },
            { text: "Contributing", link: "/guide/#contributting" },
            { text: "License", link: "/guide/#license" },
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
