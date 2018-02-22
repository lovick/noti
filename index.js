// Listing functions from libraries:
// use(), sendFile(), to(), listen(), emit(), on()

// Used for rendering the page.
var express = require('express');
var app = express();

// The actual server type stuff for socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// Stores the history of notifications sent.
var history = [];

// Enables static content delivery from needed directory (ie. CSS)
// Ideally this would point to a public folder,
// but hey, gotta follow the exceedingly specific specs.
app.use(express.static(__dirname + '/'));

// Serve the home (and only) page of the website.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// On a connection from a client
io.on('connection', function(socket){
  // Gets the client their ID for message display purposes.
  io.to(socket.id).emit('connect_acknowledge', socket.id);

  history.forEach(function(data) {
    io.to(socket.id).emit('notification', data);
  });

  // When the client gives a notification,
  // send that notification to all other clients
  socket.on('notification', function(data){
    history.push(data);
    io.emit('notification', data);
  });

});

// Needed to allow connections to the page.
http.listen(port, function(){
  console.log('listening on *:' + port);
});