export default class Style {
  constructor (gl, {
    vert = `
      precision mediump float;
      attribute vec2 position;
      attribute vec2 normal;
      varying vec2 uv;

      void main () {
        uv = 1.0 - normal;
        float x = position.x * 2.0 - 1.0;
        float y = -(position.y * 2.0 - 1.0);
        gl_Position = vec4(x, y, 0, 1);
      }
    `,

    frag = `
      precision mediump float;
      varying vec2 uv;

      void main () {
        gl_FragColor = vec4(uv, 0.0, 1.0);
      }
    `
  } = {}) {
    this.gl = gl

    const vertexShader = this.compile(gl.VERTEX_SHADER, vert)
    const fragmentShader = this.compile(gl.FRAGMENT_SHADER, frag)

    const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    this.attributes = {
      positions: gl.getAttribLocation(program, 'position'),
      normals: gl.getAttribLocation(program, 'normal')
    }

    this.uniforms = {
      width: gl.getUniformLocation(program, 'width'),
      length: gl.getUniformLocation(program, 'length')
    }

    this.program = program
  }

  compile (type, source) {
    const gl = this.gl
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

  draw (shape) {
    const gl = this.gl

    gl.useProgram(this.program)

    shape.updateBuffers()

    this.bindAttributes(shape)
    this.bindUniforms(shape)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, shape.count)
  }

  bindAttributes (shape) {
    const gl = this.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, shape.positions)
    gl.vertexAttribPointer(this.attributes.positions, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(this.attributes.positions)

    gl.bindBuffer(gl.ARRAY_BUFFER, shape.normals)
    gl.vertexAttribPointer(this.attributes.normals, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(this.attributes.normals)
  }

  bindUniforms (shape) {
    const gl = this.gl
    gl.uniform1f(this.uniforms.width, shape.width)
    gl.uniform1f(this.uniforms.length, shape.length)
  }
}
