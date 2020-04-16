export default class Wire {
  constructor ({
    shape,
    style
  } = {}) {
    this.shape = shape
    this.style = style
  }

  draw (context) {
    this.style.draw(context, this.shape)
  }
}
