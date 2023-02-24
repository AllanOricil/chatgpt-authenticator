const terser = require("@rollup/plugin-terser");
const commonjs = require("@rollup/plugin-commonjs");

const pkg = require("./package.json");

const minifiedOutputs = [
  {
    file: pkg.exports["."].import,
    format: "esm",
    exports: "named",
    plugins: [terser()],
  },
  {
    file: pkg.exports["."].require,
    format: "cjs",
    exports: "named",
    plugins: [terser()],
  },
];

const unminifiedOutputs = minifiedOutputs.map(({ file, plugins, ...rest }) => ({
  ...rest,
  file: file.replace(".min.", "."),
}));

module.exports = [
  {
    input: "./src/index.js",
    output: [...unminifiedOutputs, ...minifiedOutputs],
    plugins: [commonjs()],
  },
];
