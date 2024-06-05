module.export = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  settings: {
    "eslint.packageManager": "pnpm",
  },
  parserOptions: {
    project: true,
    tsconfigRootDir: "./tsconfig.json",
  },
};
