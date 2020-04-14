import createREGL from 'regl'

export default class Net {
  constructor ({
    canvas,
    pixelRatio
  } = {}) {
    this.pixelRatio = window.devicePixelRatio
    this.canvas = canvas || document.createElement('canvas')
    this.regl = createREGL(this.canvas)
    this.wires = []

    const regl = this.regl
  }

  add (wire) {
    wire.shaders.forEach(shader => shader.setup(this.regl))
    this.wires.push(wire)
  }

  remove (wire) {
    this.wires.splice(this.wires.indexOf(wire), 1)
  }

  resize (width, height) {
    this.canvas.width = width * this.pixelRatio
    this.canvas.height = height * this.pixelRatio
    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'
  }

  render () {
    this.regl.poll()
    
    this.regl.clear({
      color: [0, 0, 0, 0],
      depth: 1
    })

    this.wires.forEach(wire => {
      wire.shaders.forEach(shader => {
        shader.draw(wire.attributes)
      })
    })
  }
}
