const path = require('path');
const { defineConfig } = require('rollup');
const typescript = require('@rollup/plugin-typescript');

const rollupConfig = defineConfig([
  {
    input: path.resolve('./index.ts'),
    output: [
      {
        file: 'dist/index.mjs',
        name: 'DemoConfig',
        format: 'esm'
      }
    ],
    plugins: [typescript()]
  },
  {
    input: path.resolve('./index.ts'),
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs'
      }
    ],
    plugins: [typescript()]
  }
]);

module.exports = rollupConfig;
