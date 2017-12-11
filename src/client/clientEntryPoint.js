const qsOptions = require('query-string').parse(location.search);
const PlatformsClientEngine = require('../client/PlatformsClientEngine');
const PlatformsGameEngine = require('../common/PlatformsGameEngine');
const P2PhysicsEngine = require('../utils/P2PhysicsEngine');
const p2 = require('p2');

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: 1000,
    delayInputCount: 8,
    clientIDSpace: 1000000,
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 1,
        remoteObjBending: 1
    }
};
let options = Object.assign(defaults, qsOptions);

// create a client engine and a game engine
const physicsEngine = new P2PhysicsEngine();
const gameOptions = Object.assign({ physicsEngine }, options);
const gameEngine = new PlatformsGameEngine(gameOptions);
const clientEngine = new PlatformsClientEngine(gameEngine, options);

document.addEventListener('DOMContentLoaded', function(e) { clientEngine.start(); });
