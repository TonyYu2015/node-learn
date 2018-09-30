
function divEscapedContentElelment(message) {
		return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
		return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
		var message = $('#send-message').val();
		var systemMessage;
		if(message.charAt(0) === '/'){
				systemMessage = chatApp.processCommand(message);
				if(systemMessage) {
						$('#message').append(divSystemContentElement(systemMessage));
				} 
		} else {
				chatApp.sendMessage($('#room').text(), message);
				$('#message').append(divEscapedContentElelment(message));
				$('#message').scrollTop($('#message')).prop('scrollHeight')
		}

		$('#sendMessage').val('');
}


var socket = io.connect();

$(document).ready(function() {
		var chatApp = new Chat(socket);
		socket.on('nameResult', function(res) {
				var message;
				if(res.success) {
					message = "You are konwn as " + res.name + '.';
				} else {
						message = res.message;
				}
				$('#messages').append(divSystemContentElement(message));
		})

		socket.on('joinResult', function(res) {
				$('#room').text(res.room);
				$('#messages').append(divSystemContentElement('Room changed.'));
		})

		socket.on('message', function(msg) {
				var newElement = $('<div></div>').text(msg.text);
				$('#messages').append(newElement);
		})

		socket.on('rooms', function(rooms) {
				$('#room-list').empty();
				for(var room in rooms) {
						room = room.substring(1, room.length);
						if(room !== ''){
								$('#room-list').append(divEscapedContentElelment(room));
						}
				}
				$('#room-list div').click(function(){
						chatApp.processCommond('/join' + $(this).text());
						$('#send-message').focus();
				})
		});

		setInterval(function() {
			socket.emit('rooms');
		}, 1000);

		$('#send-message').focus();
		$('#send-form').submit(function() {
				processUserInput(chatApp, socket);
				return false;
		});
})






