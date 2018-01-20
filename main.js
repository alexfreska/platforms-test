const express = require('express')
const socketIO = require('socket.io')
const path = require('path')

const PORT = process.env.PORT || 3000
const INDEX = path.join(__dirname, './index.html')

const server = express()
server.get('/', (req, res) => {
  res.sendFile(INDEX)
})
server.use('/', express.static(path.join(__dirname, '.')))
const io = socketIO(
  server.listen(PORT, () => console.log(`Listening on ${PORT}`))
)

// game server
const PlatformsServerEngine = require(path.join(__dirname, 'src/server/PlatformsServerEngine'))
const PlatformsGameEngine = require(path.join(__dirname, 'src/common/PlatformsGameEngine'))
const P2PhysicsEngine = require(path.join(__dirname, 'src/utils/P2PhysicsEngine'))

// game instances
const physicsEngine = new P2PhysicsEngine()
const gameEngine = new PlatformsGameEngine({ physicsEngine })
const serverEngine = new PlatformsServerEngine(io, gameEngine, {
  timeoutInterval: 60 * 5,
  debug: {}
})

// start the game
serverEngine.start()
