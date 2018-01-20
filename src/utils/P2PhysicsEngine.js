const PhysicsEngine = require('lance-gg').physics.PhysicsEngine
const P2 = require('p2')

class P2PhysicsEngine extends PhysicsEngine {
  init(options) {
    super.init(options)
    this.options.dt = this.options.dt || (1 / 60)

    this.P2 = P2

    // Create a physics world, where bodies and constraints live
    const world = this.world = new P2.World({
      gravity: [0, -9.82]
    })

    /*let world = this.world = new CANNON.World()
    world.quatNormalizeSkip = 0
    world.quatNormalizeFast = false
    world.gravity.set(0, -10, 0)
    world.broadphase = new CANNON.NaiveBroadphase()
    this.CANNON = CANNON*/
  }

  step(dt, objectFilter) {
    this.world.step(dt || this.options.dt)
  }

  // Compute elapsed time since last render frame
  // var deltaTime = lastTime ? (time - lastTime) / 1000 : 0

  // Move bodies forward in time
  // world.step(fixedTimeStep, deltaTime, maxSubSteps)

  removeObject(obj) {
    this.world.removeBody(obj)
  }
}

module.exports = P2PhysicsEngine
