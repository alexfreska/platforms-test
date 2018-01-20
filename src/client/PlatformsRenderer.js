const Renderer = require('lance-gg').render.Renderer

class PlatformsRenderer extends Renderer {
  constructor(gameEngine, clientEngine) {
    super(gameEngine, clientEngine)
    this.sprites = {}
    this.zoom = 50
  }

  init() {
    return super.init().then(() => {
      const canvas = this.canvas = document.getElementById('myCanvas')
      const ctx = this.ctx = canvas.getContext('2d')
      ctx.lineWidth = 1 / this.zoom
    })
  }

  drawBox(object) {
    const body = object.physicsObj

    this.ctx.fillStyle = object.color
    this.ctx.beginPath()

    const x = object.position.x
    const y = object.position.y
    const w = object.width
    const h = object.height

    this.ctx.save()
    this.ctx.translate(x, y)     // Translate to the center of the box
    this.ctx.rotate(object.angle)  // Rotate to the box body frame
    this.ctx.fillRect(-w / 2, -h / 2, w, h)
    this.ctx.restore()
  }

  draw() {
    super.draw()

    const w = this.canvas.width, h = this.canvas.height

    // Clear the canvas
    this.ctx.clearRect(0, 0, w, h)

    // Transform the canvas
    // Note that we need to flip the y axis since Canvas pixel coordinates
    // goes from top to bottom, while physics does the opposite
    this.ctx.save()
    this.ctx.translate(w / 2, h / 2)  // Translate to the center
    this.ctx.scale(this.zoom, -this.zoom)   // Zoom in and flip y axis

    // Draw all bodies
    this.ctx.strokeStyle = 'none'

    for (let i in this.gameEngine.world.objects ) {
      this.drawBox(this.gameEngine.world.objects[i])
    }

    // Restore transform
    this.ctx.restore()
  }
}

module.exports = PlatformsRenderer
