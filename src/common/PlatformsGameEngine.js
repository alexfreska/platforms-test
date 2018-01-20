const GameEngine = require('lance-gg').GameEngine
const Box = require('./objects/Box')
const Char = require('./objects/Char')
const Floor = require('./objects/Floor')
const Platform = require('./objects/Platform')

let P2 = null

class PlatformsGameEngine extends GameEngine {
  constructor(options) {
    super(options)
    P2 = this.physicsEngine.P2
    this.materials = {}

    this.physicsEngine.world.defaultContactMaterial.friction = 0.5
    this.physicsEngine.world.setGlobalStiffness(1e5)

    // before the physics iteration check if there is contact
    // between top of character body and bottom of platform,
    // if so, save platform as passThroughBody
    this.physicsEngine.world.on('beginContact', (e) => {
      if (!isCharacterBodyPresent(e)) {
        return
      }

      const { characterBody, otherBody } = getCharacterAndOther(e)

      if (
        otherBody.isPlatform &&
        otherBody.position[1] > characterBody.position[1]
      ) {
        characterBody.passThroughBody = otherBody
      }
    })

    // Disable any equations between character and any pass through bodies
    this.physicsEngine.world.on('preSolve', (e) => {
      for (var i=0; i < e.contactEquations.length; i++) {
        const eq = e.contactEquations[i]
        disablePassThroughBody(eq)
      }

      for (var i=0; i < e.frictionEquations.length; i++) {
        const eq = e.frictionEquations[i]
        disablePassThroughBody(eq)
      }
    })

    this.physicsEngine.world.on('endContact', (e) => {
      removeSavedPassThroughBodyReference(e)
    })

    // init materials
    this.materials = Object.assign(this.materials, {
      ground: new P2.Material(),
      character: new P2.Material(),
      box: new P2.Material()
    })

    // Init contactmaterials
    const groundCharacterCM = new P2.ContactMaterial(
      this.materials.ground,
      this.materials.character, {
        friction : 0.0 // No friction between character and ground
    })

    const boxCharacterCM = new P2.ContactMaterial(
      this.materials.box,
      this.materials.character, {
        friction : 0.0 // No friction between character and boxes
    })

    const boxGroundCM = new P2.ContactMaterial(
      this.materials.box,
      this.materials.ground, {
        friction : 0.6 // Between boxes and ground
    })

    this.physicsEngine.world.addContactMaterial(groundCharacterCM)
    this.physicsEngine.world.addContactMaterial(boxCharacterCM)
    this.physicsEngine.world.addContactMaterial(boxGroundCM)

    this.on('server__init', () => this.gameInit())
    // this.on('client__syncReceived', () => this.clientSync())
  }

  // clientSync(sync, syncEvents, maxStepCount) {
  //     console.log(sync)
  //     console.log(syncEvents)
  //     console.log(maxStepCount)
  // }

  gameInit() {
    const floor = new Floor(++this.world.idCount, this, 0, -3)

    const box1 = new Box(++this.world.idCount, this, 2, 1)
    const box2 = new Box(++this.world.idCount, this, 0, 2)
    const box3 = new Box(++this.world.idCount, this, -2, 3)

    const platform1 = new Platform(++this.world.idCount, this, 2, 0)
    const platform2 = new Platform(++this.world.idCount, this, 0, 1)
    const platform3 = new Platform(++this.world.idCount, this, -2, 2)

    this.physicsEngine.world.on('postStep', () => {
    })

    this.addObjectToWorld(floor)

    this.addObjectToWorld(box1)
    this.addObjectToWorld(box2)
    this.addObjectToWorld(box3)

    this.addObjectToWorld(platform1)
    this.addObjectToWorld(platform2)
    this.addObjectToWorld(platform3)
  }

  start() {
    super.start()
  }

  step(isReenact) {
    super.step(isReenact)

    let walkSpeed = 2

    this.world.forEachObject((id, o) => {
      let physicsObj = o.physicsObj

      if (o.class == Char) {
        if(o.moving == 'right') {
          physicsObj.velocity[0] = walkSpeed
          o.moving = null
        } else if (o.moving === 'left') {
          physicsObj.velocity[0] = -walkSpeed
          o.moving = null
        } else {
          physicsObj.velocity[0] = 0
        }
      }

      o.position.set(physicsObj.position[0], physicsObj.position[1])
      o.velocity.set(physicsObj.velocity[0], physicsObj.velocity[1])
    })
  }

  createChar(playerId) {
    const char = new Char(++this.world.idCount, this, 0, 3)

    // set char playerId from socket playerId
    char.playerId = playerId

    // add new Char to world
    this.addObjectToWorld(char)
  }

  removeChar(playerId) {
    const char = this.world.getPlayerObject(playerId)
    if (char) {
      this.removeObjectFromWorld(char.id)
    }
  }

  processInput(inputData, playerId) {
    super.processInput(inputData, playerId)

    const walkSpeed = 2
    const jumpSpeed = 6

    const char = this.world.getPlayerObject(playerId)

    if (char) {
      if (inputData.input == 'up' && char.canJump()) {
        char.physicsObj.velocity[1] = jumpSpeed
      }

      if (inputData.input == 'right' || inputData.input == 'left') {
        char.moving = inputData.input
      }
    }
  }
}

const isCharacterBodyPresent = (e) => {
  return e.bodyA.isCharacter || e.bodyB.isCharacter
}

const getCharacterAndOther = (e) => {
  const otherBody = e.bodyA.isCharacter ? e.bodyB : e.bodyA
  const characterBody = e.bodyA.isCharacter ? e.bodyA : e.bodyB

  return {
    characterBody,
    otherBody
  }
}

const disablePassThroughBody = (eq) => {
  if (isCharacterBodyPresent(eq)) {
    const { characterBody, otherBody } = getCharacterAndOther(eq)

    if(otherBody === characterBody.passThroughBody) {
      eq.enabled = false
    }
  }
}

const removeSavedPassThroughBodyReference = (eq) => {
  if (isCharacterBodyPresent(eq)) {
    const { characterBody, otherBody } = getCharacterAndOther(eq)

    if (otherBody === characterBody.passThroughBody) {
      characterBody.passThroughBody = null
    }
  }
}

module.exports = PlatformsGameEngine
