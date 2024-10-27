const { defineConfig } = require("eslint-define-config");
const babelEslint = require("@babel/eslint-parser");

module.exports = defineConfig({
  languageOptions: {
    parser: "@babel/eslint-parser", // Use the parser you need
    parserOptions: {
      requireConfigFile: false,
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true, // Enable JSX if you're using React
      },
    },
  },
});
