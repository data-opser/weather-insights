const { defineConfig } = require("eslint-define-config");
const babelEslint = require("@babel/eslint-parser");

module.exports = defineConfig({
  parser: babelEslint,
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});
