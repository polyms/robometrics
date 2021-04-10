import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'public/robot.js',
      format: 'iife',
      name: 'robot',
      sourcemap: true,
      sourcemapFile: 'public/robot.js.map'
    },
    {
      file: 'public/robot.min.js',
      format: 'iife',
      name: 'robot',
      plugins: [terser()]
    }
  ],
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production') // development
    }),
    nodeResolve({ browser: true, extensions: ['.ts', '.tsx', '.js'] }),
    commonjs(),
    babel({
      extensions: ['.ts', '.tsx', '.js'],
      babelHelpers: 'bundled',
      include: ['src/**/*']
    })
  ]
};
