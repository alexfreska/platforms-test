const PlatformsClientEngine = require('../client/PlatformsClientEngine')
const PlatformsGameEngine = require('../common/PlatformsGameEngine')
const P2PhysicsEngine = require('../utils/P2PhysicsEngine')
const p2 = require('p2')

const options = {
  traceLevel: 1000,
  delayInputCount: 8,
  clientIDSpace: 1000000,
  syncOptions: {
    sync: 'extrapolate',
    localObjBending: 1,
    remoteObjBending: 1
  }
}

const physicsEngine = new P2PhysicsEngine()
const gameOptions = Object.assign({ physicsEngine }, options)
const gameEngine = new PlatformsGameEngine(gameOptions)
const clientEngine = new PlatformsClientEngine(gameEngine, options)

document.addEventListener('DOMContentLoaded', (e) => {
  clientEngine.start()
})
