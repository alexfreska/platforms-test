const DynamicObject = require('lance-gg').serialize.DynamicObject
const TwoVector = require('lance-gg').serialize.TwoVector

let P2 = null

class Box extends DynamicObject {
  constructor(id, gameEngine, x, y) {
    super(id, new TwoVector(x, y))
    this.class = Box
    this.gameEngine = gameEngine

    this.width = 0.8
    this.height = 0.8
    this.color = 'red'
  }

  get bendingMultiple() {
    return 0.8
  }

  get velocityBendingMultiple() {
    return 0
  }

  onAddToWorld(gameEngine) {
    console.log(`SPRITE ADD TO WORLD ${super.toString()}`)
    P2 = gameEngine.physicsEngine.P2
    this.gameEngine = gameEngine
    const { width, height } = this

    const boxShape = new gameEngine.physicsEngine.P2.Box({
      width,
      height,
    })

    const boxBody = this.physicsObj = new gameEngine.physicsEngine.P2.Body({
      mass: 1,
      angle: 0,
      position:[this.position.x, this.position.y]
    })

    boxShape.material = gameEngine.materials.box
    boxBody.addShape(boxShape)

    gameEngine.physicsEngine.world.addBody(boxBody)

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

module.exports = Box
