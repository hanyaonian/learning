module.export = {
  root: true,
  env: {
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  settings: {
    "eslint.packageManager": "pnpm",
  },
  parserOptions: {
    project: true,
  },
};
