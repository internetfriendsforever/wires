import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: './src/index.js',

  output: [
    {
      file: 'dist/esm.js',
      format: 'esm'
    },

    {
      file: 'dist/cjs.js',
      format: 'cjs'
    },

    {
      file: 'dist/iife.js',
      format: 'iife',
      name: 'wires'
    }
  ],
  
  plugins: [
    resolve(),
    commonjs()
  ],

  watch: {
    clearScreen: false
  }
}
