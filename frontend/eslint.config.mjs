import js from "@eslint/js";

export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // Включите поддержку JSX
        },
      },
    },
    files: ["**/*.js", "**/*.jsx"], // Добавьте расширение .jsx
    rules: {
      "no-unused-vars": "warn",
      semi: ["error", "always"],
      // Добавьте другие правила по мере необходимости
    },
  },
];
