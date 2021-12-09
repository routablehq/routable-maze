const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
const {refereeApi} = require('./refereeApi');

const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 8080;
const refereePort = 8081

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

refereeApi.listen(refereePort, () => {
  console.log(`Referee is listening on port ${refereePort}`)
})
