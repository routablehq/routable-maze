const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');

const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 8080;

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
    console.log(payload)
    socket.broadcast.emit('new_player_location', { x, y, id: socket.id } );
  });
  
  socket.emit('server connected', 'server connected OK');
});
