const { defineConfig } = require("eslint-define-config");

export default defineConfig({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
});
