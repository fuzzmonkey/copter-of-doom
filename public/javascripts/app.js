//= require controls
//= require events
//= require pictures
//= require leap-controls
require(['events','leapControls'], function(Events, LeapControls) {
	var app = {
		flying: false,
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
	var leap = new LeapControls(app);
	leap.eventLoop();

	app.socket.on('connect', function() {
		app.connected();
	});
});
