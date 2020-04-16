export default class Style {
  setup (gl) {
    const { vert, frag } = this.constructor

    const vertexShader = this.compile(gl, gl.VERTEX_SHADER, vert)
    const fragmentShader = this.compile(gl, gl.FRAGMENT_SHADER, frag)

    const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    this.attributeLocations = {
      positions: gl.getAttribLocation(program, 'position'),
      normals: gl.getAttribLocation(program, 'normal')
    }

    this.uniformLocations = {
      dimensions: gl.getUniformLocation(program, 'dimensions'),
      width: gl.getUniformLocation(program, 'width'),
      length: gl.getUniformLocation(program, 'length')
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

  draw (context, shape) {
    const gl = context.gl

    if (!this.program) {
      this.setup(gl)
    }

    shape.update(gl)

    gl.useProgram(this.program)

    this.bindAttributes(context, shape)
    this.bindUniforms(context, shape)

    const count = shape.positions.length / 2
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count)
  }

  bindAttributes (context, shape) {
    const gl = context.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffers.positions)
    gl.vertexAttribPointer(this.attributeLocations.positions, 2, gl.FLOAT, false, 0, 0) 
    gl.enableVertexAttribArray(this.attributeLocations.positions)

    gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffers.normals)
    gl.vertexAttribPointer(this.attributeLocations.normals, 2, gl.FLOAT, false, 0, 0) 
    gl.enableVertexAttribArray(this.attributeLocations.normals)
  }

  bindUniforms (context, shape) {
    const gl = context.gl

    gl.uniform2f(this.uniformLocations.dimensions, context.width, context.height)
    gl.uniform1f(this.uniformLocations.width, shape.props.width)
    gl.uniform1f(this.uniformLocations.length, shape.length)
  }
}

Style.Basic = class extends Style {}

Style.Basic.vert = `
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

Style.Basic.frag = `
  precision mediump float;
  varying vec2 uv;

  void main () {
    gl_FragColor = vec4(uv, 0.0, 1.0);
  }
`
