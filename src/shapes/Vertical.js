import BezierShape from './Bezier'

export default class VerticalShape extends BezierShape {
  calculatePoints ({
    from,
    to,
    segments,
    curve = 0.5
  }) {
    const [x1, y1] = from
    const [x2, y2] = to

    const diff = Math.abs(x1 - x2)

    return super.calculatePoints({
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
