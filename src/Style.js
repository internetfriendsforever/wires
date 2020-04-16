export default class Style {
  constructor ({ width = 5 } = {}) {
    this.width = width
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
      width: gl.getUniformLocation(program, 'width'),
      length: gl.getUniformLocation(program, 'length')
    }

    this.attributeLocations = {
      positions: gl.getAttribLocation(program, 'position'),
      normals: gl.getAttribLocation(program, 'normal')
    }

    this.buffers = {
      positions: gl.createBuffer(),
      normals: gl.createBuffer()
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

    console.log(this.lastChange, shape.changed)

    if ((this.lastChange || 0) < shape.changed) {
      console.log('shape changed')
      this.lastChange = shape.changed
      this.calculateGeometry(shape.points)
      this.updateBuffers(context)
    }

    gl.useProgram(this.program)

    this.bindBuffers(context)
    this.bindUniforms(context, shape)
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.positions.length / 2)
  }

  calculateGeometry (points) {
    const add = (a, b) => a + b

    const positions = []
    const normals = []
    const angles = []
    const lengths = []

    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i]
      const [x2, y2] = points[i + 1]
      const dx = x1 - x2
      const dy = y1 - y2
      angles.push(Math.atan2(dx, dy))
      lengths.push(Math.sqrt(dx * dx + dy * dy))
    }

    for (let i = 0; i < points.length; i++) {
      // Average of previous and next angle
      const [x1, y1] = points[i]

      const nearAngles = [angles[i - 1], angles[i]].filter(Boolean)
      const angle = nearAngles.reduce(add, 0) / nearAngles.length

      const la = angle - Math.PI / 2
      const ra = angle + Math.PI / 2
      const lx = x1 + Math.sin(la) * this.width
      const ly = y1 + Math.cos(-la) * this.width
      const rx = x1 + Math.sin(ra) * this.width
      const ry = y1 + Math.cos(-ra) * this.width

      positions.push(lx, ly, rx, ry)
    }

    this.length = lengths.reduce(add, 0)

    let offset = 0

    for (let i = 0; i < points.length; i++) {
      if (i > 0) {
        offset += lengths[i - 1] / this.length
      }
      
      normals.push(offset, 0, offset, 1)
    }

    this.positions = positions
    this.normals = normals
  }

  updateBuffers (context) {
    const gl = context.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.positions);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
  }

  bindBuffers (context) {
    const gl = context.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.positions)
    gl.vertexAttribPointer(this.attributeLocations.positions, 2, gl.FLOAT, false, 0, 0) 
    gl.enableVertexAttribArray(this.attributeLocations.positions)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normals)
    gl.vertexAttribPointer(this.attributeLocations.normals, 2, gl.FLOAT, false, 0, 0) 
    gl.enableVertexAttribArray(this.attributeLocations.normals)
  }

  bindUniforms (context) {
    const gl = context.gl
    gl.uniform2f(this.uniformLocations.dimensions, context.width, context.height)
    gl.uniform1f(this.uniformLocations.width, this.width)
    gl.uniform1f(this.uniformLocations.length, this.length)
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
    uv = normal;
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
