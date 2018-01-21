'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');

// define routes and socket
const server = express();
server.get('/', function(req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '.')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);

// Game Server
const PlatformsServerEngine = require(path.join(__dirname, 'src/server/PlatformsServerEngine.js'));
const PlatformsGameEngine = require(path.join(__dirname, 'src/common/PlatformsGameEngine.js'));
const P2PhysicsEngine = require(path.join(__dirname, 'src/new-code/P2PhysicsEngine'));

// Game Instances
const physicsEngine = new P2PhysicsEngine();
const gameEngine = new PlatformsGameEngine({ physicsEngine });
const serverEngine = new PlatformsServerEngine(io, gameEngine, { timeoutInterval: 60 * 5 , debug: {} });

// start the game
serverEngine.start();
