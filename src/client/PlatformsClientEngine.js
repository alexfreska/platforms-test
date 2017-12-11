const Howler = require('howler'); // eslint-disable-line no-unused-vars
const ClientEngine = require('lance-gg').ClientEngine;
const PlatformsRenderer = require('../client/PlatformsRenderer');
const MobileControls = require('../client/MobileControls');
const KeyboardControls = require('../client/KeyboardControls');
const Utils = require('./../common/Utils');

class PlatformsClientEngine extends ClientEngine {
    constructor(gameEngine, options) {
        super(gameEngine, options, PlatformsRenderer);

        this.serializer.registerClass(require('../common/objects/Box'));
        this.serializer.registerClass(require('../common/objects/Char'));
        this.serializer.registerClass(require('../common/objects/Floor'));
        this.serializer.registerClass(require('../common/objects/Platform'));

        this.gameEngine.on('client__preStep', this.preStep.bind(this));
    }

    start() {

        return super.start().then(() => {
            if (Utils.isTouchDevice()){
                this.controls = new MobileControls(this.renderer);
            } else {
                this.controls = new KeyboardControls(this.renderer);
            }
        });

    }

    // extend ClientEngine connect to add own events
    connect() {
        return super.connect().then(() => {

            this.socket.on('disconnect', (e) => {
                console.log('disconnected');

            });


        });
    }

    // our pre-step is to process inputs that are "currently pressed" during the game step
    preStep() {
        if (this.controls) {
            if (this.controls.activeInput.up) {
                this.sendInput('up', { movement: true });
            }

            if (this.controls.activeInput.left) {
                this.sendInput('left', { movement: true });
            }

            if (this.controls.activeInput.right) {
                this.sendInput('right', { movement: true });
            }
        }
    }

}

module.exports = PlatformsClientEngine;
