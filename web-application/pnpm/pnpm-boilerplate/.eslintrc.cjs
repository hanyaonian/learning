/* eslint-env node */
module.exports = {
  // extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended-type-checked"],
  extends: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json", "./packages/*/tsconfig.json"],
  },
  root: true,
};
