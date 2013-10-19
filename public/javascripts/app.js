//= require controls
//= require events
//= require pictures
require(['events', 'pictures'], function(Events, Pictures) {
	var app = {
		connected: function() {
			events.start();
			pictures.update();
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
	var pictures = new Pictures(app);

	app.socket.on('connect', function() {
		app.connected();
	});
});
