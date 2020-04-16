export default class Shader {
  prepare (gl) {
    const { vert, frag } = this.constructor

    const vertexShader = this.compile(gl, gl.VERTEX_SHADER, vert)
    const fragmentShader = this.compile(gl, gl.FRAGMENT_SHADER, frag)

    const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    this.uniformLocations = {
      dimensions: gl.getUniformLocation(program, 'dimensions'),
      thickness: gl.getUniformLocation(program, 'thickness'),
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

  draw (context) {
    const { gl, count, buffers, width, height, length } = context

    const positions = gl.getAttribLocation(this.program, 'position')
      
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions)
    gl.vertexAttribPointer(positions, 2, gl.FLOAT, false, 0, 0) 
    gl.enableVertexAttribArray(positions)

    const normals = gl.getAttribLocation(this.program, 'normal')

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals)
    gl.vertexAttribPointer(normals, 2, gl.FLOAT, false, 0, 0) 
    gl.enableVertexAttribArray(normals)

    gl.useProgram(this.program)

    this.uniforms(context)
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count)
  }

  uniforms (context) {
    const { gl, width, height, thickness, length } = context
    gl.uniform2f(this.uniformLocations.dimensions, width, height)
    gl.uniform1f(this.uniformLocations.thickness, thickness)
    gl.uniform1f(this.uniformLocations.length, length)
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
