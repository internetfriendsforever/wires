const defaultVert = `
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
`

const defaultFrag = `
  precision mediump float;
  varying vec2 uv;

  void main () {
    gl_FragColor = vec4(uv, 0.0, 1.0);
  }
`

export default function (gl, {
  vert = defaultVert,
  frag = defaultFrag
} = {}) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vert)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, frag)

  const program = gl.createProgram()

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const attributes = {
    positions: gl.getAttribLocation(program, 'position'),
    normals: gl.getAttribLocation(program, 'normal')
  }

  const uniforms = {
    width: gl.getUniformLocation(program, 'width'),
    length: gl.getUniformLocation(program, 'length')
  }

  return {
    program,
    draw: shape => {
      gl.useProgram(program)

      gl.bindBuffer(gl.ARRAY_BUFFER, shape.positions)
      gl.vertexAttribPointer(attributes.positions, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(attributes.positions)

      gl.bindBuffer(gl.ARRAY_BUFFER, shape.normals)
      gl.vertexAttribPointer(attributes.normals, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(attributes.normals)

      gl.uniform1f(uniforms.width, shape.width)
      gl.uniform1f(uniforms.length, shape.length)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, shape.count)
    }
  }
}

function compileShader (gl, type, source) {
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
