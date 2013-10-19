//= require controls
//= require events
//= require pictures
require(['events'], function(Events) {
	var app = {
		connected: function() {
			events.start();
		},
		socket: io.connect('localhost'),
		send: function(cmd, value) {
			this.socket.emit('command', {
				cmd: cmd,
				value: value
			});
		}
	};

	var events = new Events(app);

	app.socket.on('connect', function() {
		app.connected();
	});
});
