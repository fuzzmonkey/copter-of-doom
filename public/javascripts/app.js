// e.g.  //= require main
(function(global) {

	global.app = {
		connected: function() {
			setupEvents();
		}
	};

	var socket = io.connect('localhost');

	socket.on('connect', function() {
		app.connected();
	});

	app.send = function(cmd, value) {
		socket.emit('command', {
			cmd: cmd,
			value: value
		});
	};

	function setupEvents() {
		$('button').prop('disabled', false);
		$('#takeoff').on('click', function() {
			app.send('takeoff');
		});

		$('#land').on('click', function() {
			app.send('land');
		});
	}

	$(function() {
		$('button').prop('disabled', true);
	});

}(this));
