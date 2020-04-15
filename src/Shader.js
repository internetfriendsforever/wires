export default class Shader {
  prepare (gl) {
    const { vert, frag } = this.constructor

    const vertexShader = this.compile(gl, gl.VERTEX_SHADER, vert)
    const fragmentShader = this.compile(gl, gl.FRAGMENT_SHADER, frag)

    const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

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

// class LineShader extends Shader {}

// Shader.Line = LineShader

// Shader.Line.frag = `
//   precision mediump float;
//   // uniform float phase;
//   varying vec2 uv;
//   const float phase = 0.0;

//   void main () {
//     vec3 color = vec3(0.0);
//     float flow = smoothstep(0.9, 1.0, sin(uv.y * 5.0 - 1.0 + sin((uv.x - phase / 5.0) * 200.0)));
//     gl_FragColor = vec4(color, flow);
//   }
// `
