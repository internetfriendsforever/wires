export default class Shape {
  constructor (gl, params) {
    this.gl = gl
    this.params = params
    this.positions = gl.createBuffer()
    this.normals = gl.createBuffer()
    this.dirty = true
  }

  get points () {
    return []
  }

  updateBuffers () {
    const gl = this.gl

    if (this.dirty) {
      const extrusion = extrudePolyline(this.points, this.params.width)

      gl.bindBuffer(gl.ARRAY_BUFFER, this.positions)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(extrusion.positions), gl.STATIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, this.normals)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(extrusion.normals), gl.STATIC_DRAW)

      this.count = extrusion.positions.length / 2
      this.length = extrusion.length
      this.dirty = false
    }

    return this
  }
}

function extrudePolyline (points, width) {
  const add = (a, b) => a + b
  const sum = array => array.reduce(add, 0)
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
    const angle = sum(nearAngles) / nearAngles.length

    const la = angle - Math.PI / 2
    const ra = angle + Math.PI / 2
    const lx = x1 + Math.sin(la) * width
    const ly = y1 + Math.cos(-la) * width
    const rx = x1 + Math.sin(ra) * width
    const ry = y1 + Math.cos(-ra) * width

    positions.push(lx, ly, rx, ry)
  }

  const length = sum(lengths)

  let offset = 0

  for (let i = 0; i < points.length; i++) {
    if (i > 0) {
      offset += lengths[i - 1] / length
    }

    normals.push(offset, 0, offset, 1)
  }

  return {
    positions,
    normals,
    length
  }
}
