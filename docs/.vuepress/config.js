const { name, description } = require("../../package.json");

module.exports = {
  title: name,
  description: description,

  base: process.env.BASE ?? "/",

  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
      {
        text: "GitHub",
        link: "https://github.com/guesant/fabricjs-object-fit"
      }
    ],
    sidebar: "auto",
    searchPlaceholder: "Search..."
  },
  plugins: [["vuepress-plugin-typedoc"]]
};
