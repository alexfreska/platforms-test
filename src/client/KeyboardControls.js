const EventEmitter = require('eventemitter3')

const keyCodeTable = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
}

class KeyboardControls {
  constructor(renderer) {
    Object.assign(this, EventEmitter.prototype)
    this.renderer = renderer

    this.setupListeners()

    this.activeInput = {
        up: false,
        left: false,
        right: false
    }
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => {
      this.onKeyChange(e, true)
    })

    document.addEventListener('keyup', (e) => {
      this.onKeyChange(e, false)
    })
  }

  onKeyChange(e, isDown) {
    e = e || window.event
    const keyName = keyCodeTable[e.keyCode]

    if (keyName) {
      this.activeInput[keyName] = isDown
      // keep reference to the last key pressed to avoid duplicates
      this.lastKeyPressed = isDown ? e.keyCode : null
      // this.renderer.onKeyChange({ keyName, isDown })
      e.preventDefault()
    }
  }
}

module.exports = KeyboardControls
