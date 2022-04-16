import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));

server.listen(3000, function () {
  console.log('listening on *:3000');
});