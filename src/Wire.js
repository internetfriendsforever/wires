import Shader from './Shader'
import Shape from './Shape'

export default class Wire {
  constructor ({
    from,
    to,
    shape = new Shape(),
    shaders = [new Shader()]
  } = {}) {
    this._from = from
    this._to = to
    this.shape = shape
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
    const { positions, normals, thickness, length } = this.shape.calculate(this._from, this._to)

    this.count = positions.length / 2

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.positions);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    this.thickness = thickness
    this.length = length
  }

  draw (width, height) {
    const { gl, buffers, count, thickness, length } = this

    this.shaders.forEach(shader => {
      shader.draw({
        gl,
        buffers,
        width,
        height,
        count,
        thickness,
        length
      })
    })
  }
}
