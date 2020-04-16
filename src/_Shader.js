export default class Shader {
  draw (shape, context) {
    const gl = context.gl

    if (!this.program) {
      this.setup(gl)
    }

    gl.useProgram(this.program)

    gl.uniform2f(this.uniformLocations.dimensions, context.width, context.height)
    gl.uniform1f(this.uniformLocations.shapeThickness, shape.thickness)
    gl.uniform1f(this.uniformLocations.shapeLength, shape.length)

    shape.bind(context, this.program)
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, shape.count)
  }

  setup (gl) {
    const { vert, frag } = this.constructor

    const vertexShader = this.compile(gl, gl.VERTEX_SHADER, vert)
    const fragmentShader = this.compile(gl, gl.FRAGMENT_SHADER, frag)

    const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    this.uniformLocations = {
      dimensions: gl.getUniformLocation(program, 'dimensions'),
      shapeThickness: gl.getUniformLocation(program, 'shapeThickness'),
      shapeLength: gl.getUniformLocation(program, 'shapeLength')
    }

    this.program = program
  }

  compile (gl, type, source) {
    const shader = gl.createShader(type)
    
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error([
        'Error compiling shader:',
        gl.getShaderInfoLog(shader),
        source
      ].join('\n'))
    } else {
      return shader
    }
  }
}

Shader.vert = `
  precision mediump float;
  attribute vec2 position;
  attribute vec2 normal;
  uniform vec2 dimensions;
  varying vec2 uv;

  void main () {
    uv = 1.0 - normal;
    float x = (position.x / dimensions.x) * 2.0 - 1.0;
    float y = -((position.y / dimensions.y) * 2.0 - 1.0);
    gl_Position = vec4(x, y, 0, 1);
  }
`

Shader.frag = `
  precision mediump float;
  varying vec2 uv;

  void main () {
    gl_FragColor = vec4(uv, 1.0, 1.0);
  }
`
