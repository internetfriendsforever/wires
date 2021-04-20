import polyline from './polyline'

export default function (gl, controlPoints, {
  segments = 50,
  ...params
} = {}) {
  const points = Array(segments + 1).fill().map((_, i) => (
    bezier(i / (segments), ...controlPoints)
  ))

  return polyline(gl, points, params)
}

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
