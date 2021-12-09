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
  socket.on('client connected', (payload) => {
    console.log('client connected', payload)
  });
  
  socket.emit('server connected', 'server connected OK');
});
