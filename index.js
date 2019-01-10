var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var usersOnline = 0;
var users = [];

io.on('connection', function(socket){
  
  /*socket.userId = userId ++;
  console.log('a user connected, user id: ' + socket.userId);

  socket.on('chat', function(msg){
    console.log('message from user#' + socket.userId + ": " + msg);
    io.emit('chat', {
      id: socket.userId,
      msg: msg
    });
  });*/
  
  socket.on('move', function(msg){
		console.log("Move Command Called with " + msg);
	    //msg: id p.x p.y p.z
		//Process Move Data 
		var data = msg.split(" ");
		var id = Number(data[0]);
		
		users[id].p_x = Number(data[1]);
		users[id].p_y = Number(data[2]);
		users[id].p_z = Number(data[3]);
		
		console.log(users[id]);
		
		//Send Move Command
		io.emit('move',  msg);
  });
  
  socket.on('loginAttempt', function(msg){
	    // msg: username
		console.log("Login from: " + msg + " attempted");
		
		users.push(new Client(msg, usersOnline, socket));
		console.log(users[usersOnline]);
		//io.emit('loginCert', msg + " " + usersOnline );
		socket.emit('loginCert', msg + " " + usersOnline);
		
		usersOnline++;
  });
  
});

//Client Class

function Client(user, id, sock) {
	this.username = user;
	this.id = id;
	this.socket = "sock";
	this.p_x = 0;
	this.p_y = 0;
	this.p_z = 0;
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});