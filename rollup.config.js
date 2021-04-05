import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-transition-group': 'ReactTransitionGroup',
  'react-table': 'ReactTable'
};

export default {
  input: 'src/index.tsx',
  output: {
    file: 'public/robot.js',
    format: 'iife',
    name: 'robot',
    globals,
    sourcemap: true,
    sourcemapFile: 'public/robot.js.map'
  },
  plugins: [
    nodeResolve({ browser: true, extensions: ['.tsx'] }),
    commonjs(),
    babel({
      extensions: ['.ts', '.tsx'],
      babelHelpers: 'bundled',
      include: ['src/**/*'],
      exclude: /node_modules/
    })
  ],
  external: Object.keys(globals)
};
