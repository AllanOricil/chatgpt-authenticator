import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import copy from 'rollup-plugin-copy'
import clean from "rollup-plugin-delete";
import cleanup from "rollup-plugin-cleanup";

import packageJson from "./package.json";

export default {
  input: "./src/index.js",
  output: [
    {
      file: packageJson.exports["."].import,
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
    {
      file: packageJson.exports["."].require,
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    clean({ targets: "dist/*" }),
    cleanup(),
    nodeResolve(),
    copy({
      targets: [
        { src: 'src/index.d.ts', dest: 'dist' },
      ]
    }),
    babel({ exclude: /node_modules/ }),
    commonjs({ exclude: /node_modules/ }),
  ],
  external: ["fetch-cookie", "node-fetch", "set-cookie-parser"],
};
