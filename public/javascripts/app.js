//= require socket
//= require controls
//= require events
//= require pictures
require(['events','socket'], function(Events, Socket) {
	var app = {
		connected: function() {
			events.start();
		}
	};

	var events = new Events(app);
	var socket = new Socket(app);
});