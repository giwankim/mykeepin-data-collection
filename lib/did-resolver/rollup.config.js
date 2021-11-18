import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';

import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: './lib/index.ts',
  plugins: [
    external(),
    resolve({ jsnext: true, preferBuiltins: true, extensions }),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
    commonjs({ include: 'node_modules/**' }),
    babel({ extensions, include: ['lib'], runtimeHelpers: true }),
    json(),
  ],
  output: [{ file: pkg.module, format: 'cjs' }],
};
