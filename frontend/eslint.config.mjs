import js from "@eslint/js";

export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020, // Укажите нужную версию ECMAScript
        sourceType: "module", // Укажите, если используете модули
      },
    },
    files: ["**/*.js"],
    rules: {
      "no-unused-vars": "warn",
      semi: ["error", "always"],
    },
  },
];
