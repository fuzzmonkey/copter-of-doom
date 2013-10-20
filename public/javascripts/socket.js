define('socket', function() {
	function Socket(app) {
		this.app = app;
		app.socket = io.connect('localhost');
		app.send = function(cmd, value) {
			this.socket.emit('command', {
				cmd: cmd,
				value: value
			});
		}
		app.socket.on('connect', function() {
			app.connected();
		});
		app.socket.on('navdata', function (data) {
			$("#altitude").html(data.navdata.altitudeMeters);
			$("#battery").html(data.navdata.batteryPercentage);
			$("#fly-state").html(data.navdata.controlState);
			$("#control-state").html(data.navdata.flyState);
		});
	}

	return Socket;
});
