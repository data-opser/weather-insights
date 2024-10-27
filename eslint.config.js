import { defineConfig } from "eslint-define-config";
import babelEslint from "@babel/eslint-parser";

export default defineConfig({
  parser: babelEslint, // Set the parser directly
  parserOptions: {
    requireConfigFile: false, // Use false if you don't have a Babel config file
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});
