// add our variables
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent');
const fs = require('fs');

// loading the page index.html to root route.
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

// set up sockets on connection
io.sockets.on('connection', function(socket, username) {
	//when the username is received it's stored as a session variable and informs the other people
	socket.on('new_client', function(username) {
		// encodes the username
		username = ent.encode(username);
		// saves it to the session
		socket.username = username;
		// broadcast it out
		socket.broadcast.emit('new_client', username);
	});

	// when a message is received, the clietns user name is send to others.

	socket.on('message', function(message) {
		// encode the message
		message = ent.encode(message);
		// broadcast it as an object
		socket.broadcast.emit('message', {username: socket.username, message: message});
	});
});

server.listen(9000);
