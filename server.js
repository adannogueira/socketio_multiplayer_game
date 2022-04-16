import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import createGame from './public/game';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const game = createGame();
game.start();
game.subscribe(command => io.emit(command.type, command));
app.use(express.static('public'));

io.on('connection', (socket) => {
  const playerId = socket.id;
  console.log(`Player ${playerId} connected 😸`);
  game.addPlayer({ playerId });
  socket.emit('setup', game.state);
  socket.on('disconnecting', () => {
    socket.emit('stopKeyboardListener', playerId);
  });
  socket.on('disconnect', () => {
    game.removePlayer({ playerId });
    console.log(`Player ${playerId} disconnected 😿`);
  })
  socket.on('movePlayer', command => {
    command.playerId = playerId;
    command.type = 'movePlayer';
    game.movePlayer(command);
  })
});

server.listen(3000, function () {
  console.log('listening on *:3000');
});