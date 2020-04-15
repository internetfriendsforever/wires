import Shader from './Shader'
import Geometry from './Geometry'

export default class Wire {
  constructor ({
    from,
    to,
    geometry = new Geometry(),
    shaders = [new Shader()]
  } = {}) {
    this._from = from
    this._to = to
    this.geometry = geometry
    this.shaders = shaders
  }

  prepare (gl) {
    this.gl = gl

    this.shaders.forEach(shader => shader.prepare(gl))
    
    this.buffers = {
      positions: gl.createBuffer(),
      normals: gl.createBuffer()
    }

    this.update()
  }

  set from (from) {
    this._from = from
    
    if (this.gl) {
      this.update()
    }
  }

  set to (to) {
    this._to = to

    if (this.gl) {
      this.update()
    }
  }

  update () {
    const { gl } = this
    const { positions, normals } = this.geometry.calculate(this._from, this._to)

    this.count = positions.length / 2

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.positions);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  }

  draw (width, height) {
    const { gl } = this

    this.shaders.forEach(shader => {
      const positions = gl.getAttribLocation(shader.program, 'position')
      
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.positions)
      gl.vertexAttribPointer(positions, 2, gl.FLOAT, false, 0, 0) 
      gl.enableVertexAttribArray(positions)

      const normals = gl.getAttribLocation(shader.program, 'normal')

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normals)
      gl.vertexAttribPointer(normals, 2, gl.FLOAT, false, 0, 0) 
      gl.enableVertexAttribArray(normals)

      gl.useProgram(shader.program)

      const dimensions = gl.getUniformLocation(shader.program, 'dimensions')

      gl.uniform2f(dimensions, width, height)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.count)
    })
  }
}
