const typescript = require("@rollup/plugin-typescript");
const commonjs = require("@rollup/plugin-commonjs");

module.exports = [
  {
    input: "./src/sample.ts",
    output: {
      file: "dist/sample.js",
      format: "cjs",
    },
    plugins: [typescript(), commonjs()],
  },
  {
    input: "./src/explanation.ts",
    output: {
      file: "dist/explanation.js",
      format: "cjs",
    },
    plugins: [typescript(), commonjs()],
  },
];
