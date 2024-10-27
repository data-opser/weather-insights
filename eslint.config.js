const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
});
