export default class Shape {
  constructor (props) {
    this.props = { width: 10 }
    this.points = []
    this.set(props)
  }

  set (props) {
    Object.assign(this.props, props)
    this.changed = true
  }

  update (gl) {
    if (!this.buffers) {
      this.setupBuffers(gl)
    }

    if (this.changed) {
      this.changed = false
      this.calculateGeometry(this.calculatePoints(this.props))
      this.updateBuffers(gl)
    }
  }

  setupBuffers (gl) {
    this.buffers = {
      positions: gl.createBuffer(),
      normals: gl.createBuffer()
    }
  }

  updateBuffers (gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.positions);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
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
      const lx = x1 + Math.sin(la) * this.props.width
      const ly = y1 + Math.cos(-la) * this.props.width
      const rx = x1 + Math.sin(ra) * this.props.width
      const ry = y1 + Math.cos(-ra) * this.props.width

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
}

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

  calculatePoints ({ points, segments = 50 }) {
    return Array(segments + 1).fill().map((_, i) => {
      const t = this.easeInOut(i / (segments))
      return this.bezier(t, ...points)
    })
  }
}

Shape.Horizontal = class extends Shape.Bezier {
  calculatePoints ({ from, to, width, segments, curve = 0.5 }) {
    const [x1, y1] = from
    const [x2, y2] = to

    const diff = Math.abs(x1 - x2)

    return super.calculatePoints({
      width,
      segments,
      points: [
        [x1, y1],
        [x1 + diff * curve, y1],
        [x2 - diff * curve, y2],
        [x2, y2]
      ]
    })
  }
}

Shape.Vertical = class extends Shape.Bezier {
  calculatePoints ({ from, to, width, segments, curve = 0.5 }) {
    const [x1, y1] = from
    const [x2, y2] = to

    const diff = Math.abs(x1 - x2)

    return super.calculatePoints({
      width,
      segments,
      points: [
        [x1, y1],
        [x1, y1 + diff * curve],
        [x2, y2 - diff * curve],
        [x2, y2]
      ]
    })
  }
}