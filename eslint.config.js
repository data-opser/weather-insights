const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  languageOptions: {
    parser: "@babel/eslint-parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});
