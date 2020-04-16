export default class Net {
  constructor ({
    canvas
  } = {}) {
    this.canvas = canvas || document.createElement('canvas')
    this.gl = this.canvas.getContext('webgl')
    this.wires = []
  }

  add (wire) {
    this.wires.push(wire)
  }

  remove (wire) {
    this.wires.splice(this.wires.indexOf(wire), 1)
  }

  resize (width, height) {
    this.width = width
    this.height = height
    this.canvas.width = this.width * window.devicePixelRatio
    this.canvas.height = this.height * window.devicePixelRatio
    this.canvas.style.width = this.width + 'px'
    this.canvas.style.height = this.height + 'px'
  }

  render () {
    const { gl, width, height, canvas } = this

    gl.viewport(0, 0, canvas.width, canvas.height)
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    this.wires.forEach(wire => {
      wire.draw({
        gl,
        width,
        height
      })
    })
  }
}
