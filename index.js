var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var usersOnline = 0;
var clients = [];

io.on('connection', function(socket){
	console.log("NEW HIT: " + socket.id);
	// add new user to array
	clients.push(socket.id);
	
	// create client object and send back to newly connected user
	var client = new Client(socket.id, 'socket');
	socket.emit('connection', client);
	
	// also send location to every other user
	socket.broadcast.emit('player_location', client);
	
	
	// if receive a move event notify other users
	socket.on('move', function(data) {
		socket.broadcast.emit('player_location', data);
	});
	
	// when get a new player
	socket.on('new_players', function(data) {
		console.log('NP: ' + JSON.stringify(data)); console.log(clients);
		
		var state = false;
		// only post to users after you
		for(var i = 0; i < clients.length; i++) {
			if(state) { io.to(clients[i]).emit('player_location', data); }
			state |= clients[i] == socket.id;
		}
	});
});

//Client Class
function Client(/*user, */id, sock) {
	//this.username = user;
	this.id = id;
	this.socket = sock;
	this.p_x = 0;
	this.p_y = 0;
	this.p_z = 0;
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});