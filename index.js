var io = require('socket.io')(4567, {
	transports: ['websocket'],
	origins: '*:*'
});

var users = [];
var userRot = [];
var usersOnline = 0;

io.on('connection', function(socket){
	console.log('conn!');
	
	socket.on('login', function(data) {
		var usr = new Client("player-" + usersOnline, usersOnline++, socket);
		
		socket.emit('loginCert', {user: usr, players: users});  // send back to socket
		socket.broadcast.emit('newPlayer', {user: usr});  // send to all other sockets of new player
		
		users.push(usr);
		console.log(usr);
		
		var rotateData = new RotateCoordinate (0, 0, 0);
		userRot.push(rotateData);
	});
	
	socket.on('move', function(data) {
		console.log(data);
		
		for(var i = 0; i < users.length; i++) {
			if(users[i].id == data.id) {
				users[i].p_x = data.p_x;
				users[i].p_y = data.p_y;
				users[i].p_z = data.p_z;
				io.emit('move', { user: data});
				break;
			}
		}
	});
	
	
	/*
	socket.on('headRotate', function(data) {
		console.log('headRotate' + JSON.stringify(data));
		
		for(var i = 0; i < users.length; i++) {
			if(users[i].id == data.id) {
				socket.broadcast.emit('headRotate', { user: data}); // already did the move in our player, need to send it to everybody else
				break;
			}
		}
	});
	*/
	
	socket.on('headRotate', function(data) {
		userRot[data.id].r_x = data.r_x;
		userRot[data.id].r_y = data.r_y;
		userRot[data.id].r_z = data.r_z;
	});
	
	socket.on('rotateAllOpponents', function() {
		io.emit('rotateOpponents', {usrRotation: userRot});
	});
	
	socket.on('error', function(data) {
		console.log('<error>');
		console.log(data);
	});
});

function Client(user, id, sock) {
	this.username = user;
	this.id = id;
	this.socket = "sock";
	this.p_x = 0;
	this.p_y = 0;
	this.p_z = 0;
}

function RotateCoordinate (x, y, z) {
	this.r_x = x;
	this.r_y = y;
	this.r_z = z;
}