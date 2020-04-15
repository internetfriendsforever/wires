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

  watch: {
    clearScreen: false
  }
}
