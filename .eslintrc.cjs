module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  settings: { react: { version: "detect" } },
  rules: {
    "no-restricted-imports": [
      "warn",
      {
        paths: [
          { name: "axios", message: "Use @munlink/api-client instead" },
        ],
        patterns: ["whatwg-fetch", "cross-fetch"],
      },
    ],
  },
}


