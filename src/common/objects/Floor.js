const DynamicObject = require('lance-gg').serialize.DynamicObject
const TwoVector = require('lance-gg').serialize.TwoVector

let P2 = null

class Floor extends DynamicObject {
  constructor(id, gameEngine, x, y) {
    super(id, new TwoVector(x, y))
    this.class = Floor
    this.gameEngine = gameEngine

    this.width = 16
    this.height = 4
    this.color = 'green'
  }

  onAddToWorld(gameEngine) {
    console.log(`SPRITE ADD TO WORLD ${super.toString()}`)
    P2 = gameEngine.physicsEngine.P2
    this.gameEngine = gameEngine
    const { width, height, position } = this

    const floorShape = new gameEngine.physicsEngine.P2.Box({
      width,
      height,
    })

    let floorBody = this.physicsObj = new gameEngine.physicsEngine.P2.Body({
      mass: 0,
      angle: 0,
      position: [position.x, position.y]
    })

    floorShape.material = gameEngine.materials.ground
    floorBody.addShape(floorShape)
    gameEngine.physicsEngine.world.addBody(floorBody)

    this.scene = gameEngine.renderer ?
      gameEngine.renderer.scene : null
  }

  // update obj
  refreshFromPhysics() {
    const { position, velocity, angle } = this.physicsObj
    this.position.set(position[0], position[1])
    this.velocity.set(velocity[0], velocity[1])
    this.angle = angle
  }

  // update physicsObj
  refreshToPhysics() {
    const { position, velocity, angle } = this
    this.physicsObj.position = [position.x, position.y]
    this.physicsObj.velocity = [velocity.x, velocity.y]
    this.physicsObj.angle = this.angle
  }
}

module.exports = Floor
