var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
		var name = 'Guest' + guestNumber;
		nickNames[socket.id] = name;
		socket.emit('nameResult', {
				success: true,
				name: name
		});
		namesUsed.push(name);
		return guestNumber + 1;
}

function joinRoom(socket, room) {
		socket.join(room);
		currentRoom[socket.id] = room;
		socket.broadcast.to(room).emit('message', {
				text: nickNames[socket.id] + ' has joined ' + room + '.';
		});
		
		var usersInRoom = io.sockets.clients(room);
		if( usersInRoom.lentgh > 0 ) {
				var usersInRoomSummary = 'Users currently in ' + room + ':';
				for(var index in usersInRoom) {
						var userSocketId = usersInRoom[index].id;
						if( usersInRoom !== socket.id ) {
								if( index > 0 ) {
										usersInRoomSummary += ', ';
								}
								usersInRoomSummary += nickNames[userSocketId];
						}
				}

				usersInRoomSummary += '.';
				socket.emit('message', {
						text: usersInRoomSummary
				});
		}
}

exports.listen = function(server) {
		io = socketio.listen(server);
		io.set('log level', 1);

		io.sockets.on('connection', function(socket) {
				guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
				joinRoom(socket, 'Lobby');
				
				handleMessageBroadcasting(socket, nickNames);
				handleNameChangeAttempts(socket, nickNames, namesUsed);
				handleRoomJoining(socket);

				socket.on('rooms', function() {
						socket.emit('rooms', io.sockets.manage.rooms);
				});

				handleClientDisconnection(socket, nickNames, namesUsed);
		});
}
