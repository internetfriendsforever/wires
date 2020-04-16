function b1 (t) {
  return t * t * t
}

function b2 (t) {
  return 3 * t * t * (1 - t)
}

function b3 (t) {
  return 3 * t * (1 - t) * (1 - t)
}

function b4 (t) {
  return (1 - t) * (1 - t) * (1 - t)
}

function bezier (t, c1, c2, c3, c4) {
  return [
    c1[0] * b1(t) + c2[0] * b2(t) + c3[0] * b3(t) + c4[0] * b4(t),
    c1[1] * b1(t) + c2[1] * b2(t) + c3[1] * b3(t) + c4[1] * b4(t)
  ]
}

export default class Geometry {
  constructor ({
    steps = 50,
    thickness = 5
  } = {}) {
    this.steps = steps
    this.thickness = thickness
    this.positions = []
    this.normals = []
  }

  pointToArray (point) {
    return [point.x, point.y]
  }

  calculate (...args) {
    const points = []
    const lengths = []
    const positions = []
    const normals = []

    for (let i = 0; i < this.steps; i++) {
      const t = i / (this.steps - 1)
      const t1 = Math.min(0.99999, t)
      const t2 = Math.min(1, t + 0.00001)
      const p = bezier(t, ...args)
      const p1 = bezier(t1, ...args)
      const p2 = bezier(t2, ...args)
      const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0])

      points.push(p)

      if (i > 0) {
        const [px, py] = p
        const [prevx, prevy] = points[i - 1]
        const length = Math.sqrt(Math.pow(px - prevx, 2) + Math.pow(py - prevy, 2))
        lengths.push(length)
      }
      
      const left = [
        p[0] + Math.cos(angle - Math.PI / 2) * this.thickness,
        p[1] + Math.sin(angle - Math.PI / 2) * this.thickness
      ]
      
      const right = [
        p[0] + Math.cos(angle + Math.PI / 2) * this.thickness,
        p[1] + Math.sin(angle + Math.PI / 2) * this.thickness
      ]

      positions.push(left[0], left[1], right[0], right[1])
    }

    const thickness = this.thickness
    const length = lengths.reduce((a, b) => a + b, 0)

    let offset = 0

    normals.push(0, 0, 0, 1)

    lengths.forEach((l, i) => {
      offset += l / (length - 1)
      normals.push(offset, 0, offset, 1)
    })

    return {
      positions,
      normals,
      thickness,
      length
    }
  }
}

class HorizontalGeometry extends Geometry {
  calculate (from, to) {
    const [x1, y1] = from
    const [x2, y2] = to

    const xd = Math.abs(x1 - x2)
    const cd = xd * 0.5
    
    // TODO, better calculation
    return super.calculate(
      [x1, y1],
      [x1 + cd, y1],
      [x2 - cd, y2],
      [x2, y2]
    )
  }
}

Geometry.Horizontal = HorizontalGeometry

class VerticalGeometry extends Geometry {
  calculate (from, to) {
    const [x1, y1] = from
    const [x2, y2] = to

    const yd = Math.abs(y1 - y2)
    const cd = yd * 0.5
    
    // TODO, better calculation
    return super.calculate(
      [x1, y1],
      [x1, y1 + cd],
      [x2, y2 - cd],
      [x2, y2]
    )
  }
}

Geometry.Vertical = VerticalGeometry
