//= require socket
//= require controls
//= require events
//= require pictures
//= require leap-controls
require(['events','socket','leapControls'], function(Events, Socket, LeapControls) {
	var app = {
		flying: false,
		connected: function() {
			events.start();
			leapControls.eventLoop();
		}
	};

	var events = new Events(app);
	var socket = new Socket(app);
	var leapControls = new LeapControls(app);
});
