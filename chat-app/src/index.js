const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/messages');
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./utils/users');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname, '../public/views');
app.set('views', viewsDirectoryPath);

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket
      .emit(
        'printMessage',
        generateMessage('Server', 'Welcome!')
      );
    socket.broadcast.to(user.room)
      .emit(
        'printMessage',
        generateMessage('Server', `${user.username} has joined the chat`)
      );

    io.to(user.room)
      .emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });

    callback();
  });

  socket.on('sendMessage', (msg, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback('Profanity is not allowed');
    }

    io.to(user.room).emit('printMessage', generateMessage(user.username, msg));
    callback();
  });

  socket.on('location', (coords, callback) => {
    const user = getUser(socket.id);
    const url = `https://google.com/maps?q=${coords.latitude},${coords.longitude}`;

    io.to(user.room)
      .emit('locationMessage', generateLocationMessage(user.username, url));

    callback("Location shared!");
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room)
        .emit(
          'printMessage',
          generateMessage('Server', `${user.username} has left the chat`)
        );
      
      io.to(user.room)
        .emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room)
        });
    }
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});