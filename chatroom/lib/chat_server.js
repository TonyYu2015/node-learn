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
		console.log('room', socket.id, room);
		socket.broadcast.to(room).emit('message', {
				text: nickNames[socket.id] + ' has joined ' + room + '.'
		});
		
		var usersInRoom = io.of('/').in(room).clients;
		if( usersInRoom.lentgh > 1 ) {
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

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
		socket.on('nameAttempt', function(name) {
				if(name.indexOf("Guest") === 0) {
						socket.emit('nameResult', {
								success: false,
								message: "Names can't begin with Guest"
					})
				} else {
						if(namesUsed.indexOf(name) === -1) {
								var previousName = nickNames[socket.id];
								var previousNameIndex = namesUsed.indexOf(previousName);
								namesUsed.push(name);
								nickNames[socket.id] = name;
								delete namesUsed[previousNameIndex];
								
								socket.emit('nameResult', {
										success: true,
										message: "That name is already in used."
								})
						}
				}
		})
			
}

function handleMessageBroadcasting(socket) {
		socket.on('message', function(message) {
				console.log('==========>', message)
				socket.broadcast.to(message.room).emit('message', {
						text: nickNames[socket.id] + ': ' + message.text
				})
		})
}

function handleRoomJoining(socket) {
		socket.on('join', function(room) {
				socket.leave(currentRoom[socket.id]);
				joinRoom(socket, room.newRoom);
		});
}

function handleClientDisconnection(socket) {
		socket.on('disconnect', function(){
				var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
				delete namesUsed[socket.id];
				delete nickNames[socket.id];
		})
}

exports.listen = function(server) {
		io = socketio.listen(server);
		io.set('log level', 1);

		io.sockets.on('connection', function(socket) {
				try{

					guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
					joinRoom(socket, 'Lobby');
				
					handleMessageBroadcasting(socket, nickNames);
					handleNameChangeAttempts(socket, nickNames, namesUsed);
					handleRoomJoining(socket);

				} catch(err) {
						console.log('=========>', err);
				}
				socket.on('rooms', function() {
						socket.emit('rooms', io.of('/').adapter.rooms);
				});

				handleClientDisconnection(socket, nickNames, namesUsed);
		});
}
