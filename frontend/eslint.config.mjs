import js from "@eslint/js";

export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      "no-unused-vars": "warn",
    },
    ignores: ["frontend/package.json", "frontend/package-lock.json"],
  },
];
