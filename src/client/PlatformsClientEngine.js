const ClientEngine = require('lance-gg').ClientEngine
const PlatformsRenderer = require('../client/PlatformsRenderer')
const KeyboardControls = require('../client/KeyboardControls')

class PlatformsClientEngine extends ClientEngine {
  constructor(gameEngine, options) {
    super(gameEngine, options, PlatformsRenderer)

    this.serializer.registerClass(require('../common/objects/Box'))
    this.serializer.registerClass(require('../common/objects/Char'))
    this.serializer.registerClass(require('../common/objects/Floor'))
    this.serializer.registerClass(require('../common/objects/Platform'))

    this.gameEngine.on('client__preStep', () => this.preStep())
  }

  start() {
    return super.start().then(() => {
      this.controls = new KeyboardControls(this.renderer)
    })
  }

  // extend ClientEngine connect to add own events
  connect() {
    return super.connect().then(() => {
      this.socket.on('disconnect', (e) => {
          console.log('disconnected')
      })
    })
  }

  // our pre-step is to process inputs that are "currently pressed" during the game step
  preStep() {
    if (this.controls) {
      if (this.controls.activeInput.up) {
        this.sendInput('up', { movement: true })
      }

      if (this.controls.activeInput.left) {
        this.sendInput('left', { movement: true })
      }

      if (this.controls.activeInput.right) {
        this.sendInput('right', { movement: true })
      }
    }
  }
}

module.exports = PlatformsClientEngine
