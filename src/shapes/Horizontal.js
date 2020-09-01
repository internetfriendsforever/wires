import BezierShape from './Bezier'

export default class HorizontalShape extends BezierShape {
  get from () {
    return this.params.from || [0, 0]
  }

  get to () {
    return this.params.to || [1, 1]
  }

  get curve () {
    return this.params.curve || 0.5
  }

  set from (value) {
    this.params.from = value
    this.dirty = true
  }

  set to (value) {
    this.params.to = value
    this.dirty = true
  }

  set curve (value) {
    this.params.curve = value
    this.dirty = true
  }

  get controlPoints () {
    const { from, to, curve } = this

    const [x1, y1] = from
    const [x2, y2] = to

    const diff = Math.abs(x1 - x2)

    return [
      [x1, y1],
      [x1 + diff * curve, y1],
      [x2 - diff * curve, y2],
      [x2, y2]
    ]
  }
}
