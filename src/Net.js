export default class Net {
  constructor ({
    canvas
  } = {}) {
    this.canvas = canvas || document.createElement('canvas')
    this.gl = this.canvas.getContext('webgl')
    this.wires = []
  }

  add (wire) {
    wire.prepare(this.gl)
    this.wires.push(wire)
  }

  remove (wire) {
    this.wires.splice(this.wires.indexOf(wire), 1)
  }

  resize (width, height) {
    this.canvas.width = width * window.devicePixelRatio
    this.canvas.height = height * window.devicePixelRatio
    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'
  }

  render () {
    const { gl } = this
    const { width, height } = this.canvas

    gl.clearColor(0, 0, 0, 1)
    gl.clearDepth(1)

    gl.viewport(0, 0, width, height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    this.wires.forEach(wire => wire.draw())
  }
}
