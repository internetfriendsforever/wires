import Bezier from 'bezier-js'

export default class Geometry {
  constructor ({
    steps = 20,
    thickness = 10
  } = {}) {
    this.steps = steps
    this.thickness = thickness
    this.positions = []
    this.normals = []
  }

  pointToArray (point) {
    return [point.x, point.y]
  }

  update (...args) {
    const steps = this.steps
    const curve = new Bezier(...args)
    const segments = curve.reduce()
    const outlines = segments.map(segment => segment.outlineshapes(this.thickness)[0])

    const positions = outlines.map(shape => {
      const f = shape.forward.getLUT(steps)
      const b = shape.back.getLUT(steps).reverse()
      return Array(steps * 2).fill()
        .map((_, i) => (i % 2 ? f : b)[Math.floor(i / 2)])
        .map(this.pointToArray)
    })

    let offset = 0

    const normals = segments.map(segment => {
      return Array(steps).fill().flatMap((_, i) => {
        const split = segment.split(i / steps, (i + 1) / steps)
        const normal = [[offset, 0], [offset, 1]]
        
        if (i < steps - 1) {
          offset += split.length() * (1 / curve.length())
        }

        return normal
      })
    })

    this.positions = positions.flat()

    this.normals = positions.map((position, i) => normals[i])
  }
}

class HorizontalGeometry extends Geometry {
  update (from, to) {
    const [x1, y1] = from
    const [x2, y2] = to

    const xDiff = Math.abs(x1 - x2)
    const controlDistance = xDiff * 0.5
    
    // TODO, better calculation
    super.update(
      x1, y1,
      x1 + controlDistance, y1,
      x2 - controlDistance, y2,
      x2, y2
    )
  }
}

Geometry.Horizontal = HorizontalGeometry
