const uuid = require('uuid');
const ColorScheme = require('color-scheme');
const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
const {refereeApi} = require('./refereeApi');


// CACHE

const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 0 });

const REGISTERED_PLAYER_KEY = "registeredPlayers";
const MAZE_SEED = 123456;

const scheme = new ColorScheme();
scheme.from_hue(21).scheme('triade').variation('hard');
const colors = scheme.colors();

const nextColor = () => {
  const player_count = cache.keys().length - 1;
  return colors[player_count % colors.length];
}

const hasPlayer = (playerName) => {
  const registeredPlayers = cache.get(REGISTERED_PLAYER_KEY) || new Set();
  return registeredPlayers.has(playerName);
}

const registerPlayer = (id, playerName) => {
  const registeredPlayers = cache.get(REGISTERED_PLAYER_KEY) || new Set();
  registeredPlayers.add(playerName);
  cache.set(REGISTERED_PLAYER_KEY, registeredPlayers);
  const color = nextColor();
  const playerData = {playerName, seed: MAZE_SEED, color};
  cache.set(id, playerData)
  return playerData;
}

const removePlayer = (id) => {
  console.log(`Removing player ${id}`);
  const player = cache.take(id);
  if (player) {
    console.log(`Removing player ${JSON.stringify(player)}`);
    const registeredPlayers = cache.get(REGISTERED_PLAYER_KEY);
    registeredPlayers.delete(player.playerName);
    cache.set(REGISTERED_PLAYER_KEY, registeredPlayers);
  }
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
    const {x, y, id} = payload;
    const player = cache.get(id);
    if (player) {
      const name = player.playerName;
      const color = player.color;
      console.log(`name: ${name} ${color}: ${JSON.stringify(payload)}`);
      socket.broadcast.emit('new_player_location', { x, y, id, name, color } );
    } else {
      console.log("unregistered player: " + id);
    }
  });

  socket.on('player_unregistered', (payload) => {
    socket.broadcast.emit('player_left', payload)
  })
  
  socket.emit('server connected', 'server connected OK');
});

// API

refereeApi.post('/register', function (req, res) {
  const playerName = req.body.playerName;
  const id = req.body.id || uuid.v4();
  if (req.body.id || !hasPlayer(playerName)) {
    const playerData = registerPlayer(id, playerName);
    res.json({...playerData, id});
  } else {
    res.sendStatus(400);
  }
});

refereeApi.get('/86', function (req, res) {
  resetAll();
  res.sendStatus(204);
});

refereeApi.delete('/unregister/:id', function (req, res) {
  removePlayer(req.params.id);
  res.sendStatus(204);
})

refereeApi.listen(refereePort, () => {
  console.log(`Referee is listening on port ${refereePort}`)
});
