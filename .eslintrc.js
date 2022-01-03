module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ["standard"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    semi: [2, "always"],
    quotes: ["error", "double"]
  }
};
