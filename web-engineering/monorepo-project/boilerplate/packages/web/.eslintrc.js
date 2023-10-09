module.export = {
  root: true,
  env: {
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/eslint-recommended", "plugin:@typescript-eslint/recommended"],
  settings: {
    "eslint.packageManager": "pnpm",
  },
  parserOptions: {
    project: true,
  },
};
