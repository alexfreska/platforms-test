'use strict';

const ServerEngine = require('lance-gg').ServerEngine;
const NUM_BOTS = 3;

class PlatformsServerEngine extends ServerEngine {
    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);

        this.serializer.registerClass(require('../common/objects/Box'));
        this.serializer.registerClass(require('../common/objects/Char'));
        this.serializer.registerClass(require('../common/objects/Floor'));
        this.serializer.registerClass(require('../common/objects/Platform'));
    }

    start() {
        super.start();
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        this.gameEngine.createChar(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.gameEngine.removeChar(playerId);
    }
}

module.exports = PlatformsServerEngine;
