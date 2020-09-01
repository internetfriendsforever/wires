import bezier from './bezier'

export default function (gl, [from = [0, 0], to = [1, 1]] = [], {
  vertical = false,
  curve = 0.5,
  ...params
} = {}) {
  const [x1, y1] = from
  const [x2, y2] = to

  const diff = Math.abs(x1 - x2)

  const points = [[x1, y1]]

  if (vertical) {
    points.push(
      [x1, y1 + diff * curve],
      [x2, y2 - diff * curve]
    )
  } else {
    points.push(
      [x1 + diff * curve, y1],
      [x2 - diff * curve, y2]
    )
  }

  points.push([x2, y2])

  return bezier(gl, points, params)
}
