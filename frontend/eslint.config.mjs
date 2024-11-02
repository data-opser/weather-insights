import js from "@eslint/js";
import standard from "eslint-config-standard";

export default [
  js.configs.recommended,
  standard,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
];
