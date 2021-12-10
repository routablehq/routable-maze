const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
const {refereeApi} = require('./refereeApi');


// CACHE

const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 0 });

const REGISTERED_PLAYER_KEY = "registeredPlayers";

const hasPlayer = (playerName) => {
  const registeredPlayers = cache.get(REGISTERED_PLAYER_KEY) || new Set();
  return registeredPlayers.has(playerName);
}

const registerPlayer = (id, playerName) => {
  const registeredPlayers = cache.get(REGISTERED_PLAYER_KEY) || new Set();
  const otherPlayers = Array.from(registeredPlayers);
  registeredPlayers.add(playerName);
  cache.set(REGISTERED_PLAYER_KEY, registeredPlayers);
  cache.set(id, {playerName})
  return [123456, otherPlayers];
}

const getPlayerName = (id) => {
  return cache.has(id) ? cache.get(id).playerName : null;
}

const resetAll = () => {
  console.log("Deleting all game data!!!")
  cache.flushAll();
}

// SOCKET IO

const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 8080;
const refereePort = 8081

const io = socketIO(server);

server.listen(port, hostname, () => {
  console.log(`Server running on port ${hostname}:${port}`);
});

io.on('connection', (socket) => {
  socket.on('client_connected', (payload) => {
    console.log('client_connected', payload)
  });

  socket.on('location_change', (payload) => {
    const {x, y} = payload;
    const name = getPlayerName(socket.id);
    console.log(`name: ${name}: ${JSON.stringify(payload)}`);
    socket.broadcast.emit('new_player_location', { x, y, id: socket.id, name } );
  });
  
  socket.emit('server connected', 'server connected OK');
});

// API

refereeApi.post('/register', function (req, res) {
  const playerName = req.body.playerName;
  const id = req.body.id;
  if (!hasPlayer(playerName)) {
    const [seed, otherPlayers] = registerPlayer(id, playerName);
    res.json({"seed": seed, "playerName": req.body.playerName});
  }
});

refereeApi.get('/86', function (req, res) {
  resetAll();
  res.sendStatus(204)
});

refereeApi.listen(refereePort, () => {
  console.log(`Referee is listening on port ${refereePort}`)
});
