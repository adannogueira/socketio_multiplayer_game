import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import createGame from './public/game';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const game = createGame();
app.use(express.static('public'));

io.on('connection', (socket) => {
  const playerId = socket.id;
  console.log(`Player ${playerId} connected 😸`);
  game.addPlayer({ playerId });
  socket.emit('setup', game.state);
  socket.on('disconnect', () => {
    game.removePlayer({ playerId });
    console.log(`Player ${playerId} disconnected 😿`);
  })
});

server.listen(3000, function () {
  console.log('listening on *:3000');
});