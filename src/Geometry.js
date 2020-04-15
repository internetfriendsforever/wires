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
    steps = 20,
    thickness = 0.05
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
    const positions = []
    const normals = []

    for (let i = 0; i < this.steps; i++) {
      const t = i / (this.steps - 1)
      const t1 = Math.min(0.999, t)
      const t2 = Math.min(1, t + 0.001)
      const p1 = bezier(t1, ...args)
      const p2 = bezier(t2, ...args)
      const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0])
      
      const left = [
        p1[0] + Math.cos(angle - Math.PI / 2) * this.thickness,
        p1[1] + Math.sin(angle - Math.PI / 2) * this.thickness
      ]
      
      const right = [
        p1[0] + Math.cos(angle + Math.PI / 2) * this.thickness,
        p1[1] + Math.sin(angle + Math.PI / 2) * this.thickness
      ]

      positions.push(left[0], left[1], right[0], right[1])
      normals.push(t, 0, t, 1)
    }

    return {
      positions: positions,
      normals
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
