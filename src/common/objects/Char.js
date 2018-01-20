const DynamicObject = require('lance-gg').serialize.DynamicObject
const TwoVector = require('lance-gg').serialize.TwoVector

let P2 = null

class Char extends DynamicObject {
  constructor(id, gameEngine, x, y) {
    super(id, new TwoVector(x, y))
    this.class = Char
    this.gameEngine = gameEngine

    this.width = 0.5
    this.height = 1
    this.color = 'black'
  }

  canJump() {
    let result = false

    const { physicsEngine } = this.gameEngine
    const { contactEquations } = physicsEngine.world.narrowphase

    for (let i in contactEquations) {
      const c = contactEquations[i]

      if (c.bodyA === this.physicsObj || c.bodyB === this.physicsObj) {
        let d = P2.vec2.dot(
          c.normalA,
          P2.vec2.fromValues(0, 1) // Normal dot Y-axis
        )
        if (c.bodyA === this.physicsObj) {
          d *= -1
        }
        if (d > 0.5) {
          result = true
        }
      }
    }

    return result
  }

  onAddToWorld(gameEngine) {
    console.log(`SPRITE ADDED TO WORLD ${super.toString()}`)
    P2 = gameEngine.physicsEngine.P2
    this.gameEngine = gameEngine
    const { width, height, position } = this

    const characterShape = new gameEngine.physicsEngine.P2.Box({
      width,
      height,
    })

    const characterBody = this.physicsObj = new gameEngine.physicsEngine.P2.Body({
      mass: 1,
      angle: 0,
      position: [position.x, position.y],
      fixedRotation: true,
    })

    characterBody.material = gameEngine.materials.character
    characterBody.addShape(characterShape)
    characterBody.damping = 0.5
    characterBody.isCharacter = true

    gameEngine.physicsEngine.world.addBody(characterBody)

    this.scene = gameEngine.renderer ?
      gameEngine.renderer.scene : null
  }

  destroy() {
    console.log('CHARACTER DESTROYED')
    this.gameEngine.physicsEngine.removeObject(this.physicsObj)
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
    this.physicsObj.angle = angle
  }
}

module.exports = Char
