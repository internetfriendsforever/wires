import extrude from './extrude'

export default function (gl, points, {
  width = 0.01
} = {}) {
  const positions = gl.createBuffer()
  const normals = gl.createBuffer()

  const extrusion = extrude(points, width)

  gl.bindBuffer(gl.ARRAY_BUFFER, positions)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(extrusion.positions), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, normals)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(extrusion.normals), gl.STATIC_DRAW)

  const count = extrusion.positions.length / 2
  const length = extrusion.length

  return {
    positions,
    normals,
    count,
    width,
    length
  }
}
