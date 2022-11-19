var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function () {
  console.log('listening for requests on port 4000,');
});

// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

  console.log('made socket connection', socket.id);

  // Handle audio stream event
  socket.on('openmic', function (data) {
    // console.log(data);
    io.sockets.emit('openmic', data);
  });

  // Handle typing clients movement
  socket.on('moving', function (data) {
    socket.broadcast.emit('moving', data);
  });

});