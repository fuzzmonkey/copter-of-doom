//= require socket
//= require controls
//= require events
//= require pictures
//= require leap-controls
require(['events','socket'], function(Events, Socket) {
	var app = {
		flying: false,
		connected: function() {
			events.start();
		}
	};

	var events = new Events(app);
	var socket = new Socket(app);
});
