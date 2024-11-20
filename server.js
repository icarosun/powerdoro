import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname + '/index.html'));
});

let interval_seconds = 0;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnect');
  });

  let interval_time;
  socket.on('start-time', (minutes) => {
    console.log('> Powerdoro Start Time');
    interval_seconds = minutes;

    clearInterval(interval_time);

    interval_time = setInterval(() => {
      if (interval_seconds >= 0) {
        io.emit("time", interval_seconds);
        interval_seconds -= 1;
      }
    }, 1000);

  });

  socket.on('pause-time', (minutes) => {
    console.log('> Powerdoro Pause Time')
    clearInterval(interval_time); 

    interval_seconds = minutes;
    io.emit("time", interval_seconds);
  });

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
})
