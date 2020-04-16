export default class Shape {
  constructor (...args) {
    this.points = []
    this.update(...args)
  }

  update (...args) {
    this.points = this.calculate(...args)
    this.updateBuffers()
  }
}

// Move calculation of normals and positions to shape, whenever it's updated

Shape.Bezier = class extends Shape {
  b1 (t) {
    return t * t * t
  }

  b2 (t) {
    return 3 * t * t * (1 - t)
  }

  b3 (t) {
    return 3 * t * (1 - t) * (1 - t)
  }

  b4 (t) {
    return (1 - t) * (1 - t) * (1 - t)
  }

  bezier (t, c1, c2, c3, c4) {
    const { b1, b2, b3, b4 } = this

    return [
      c1[0] * b1(t) + c2[0] * b2(t) + c3[0] * b3(t) + c4[0] * b4(t),
      c1[1] * b1(t) + c2[1] * b2(t) + c3[1] * b3(t) + c4[1] * b4(t)
    ]
  }

  easeInOut (t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  calculate (c1, c2, c3, c4, segments = 50) {
    return Array(segments + 1).fill().map((_, i) => {
      const t = this.easeInOut(i / (segments))
      return this.bezier(t, c4, c3, c2, c1)
    })
  }
}

Shape.Horizontal = class extends Shape.Bezier {
  calculate (from, to, segments, curve = 0.5) {
    const [x1, y1] = from
    const [x2, y2] = to

    const diff = Math.abs(x1 - x2)
    
    // TODO: max/min?
    return super.calculate(
      [x1, y1],
      [x1 + diff * curve, y1],
      [x2 - diff * curve, y2],
      [x2, y2],
      segments
    )
  }
}
