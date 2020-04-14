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
    this.update()
  }

  set from (from) {
    this._from = from
    this.update()
  }

  set to (to) {
    this._to = to
    this.update()
  }

  update () {
    this.geometry.update(this._from, this._to)
  }
}
