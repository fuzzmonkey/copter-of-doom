define('controls', function() {

	function Controls(app) {
		this.app = app;
	}

	$.extend(Controls.prototype, {
		takeoff: function() {
			this.app.flying = true;
			this.app.send('takeoff');
		},
		land: function() {
			this.app.flying = false;
			this.app.send('land');
		},
		up: _.throttle(function() {
			this.app.send('up', 0.5);
		}, 200),
		down: _.throttle(function() {
			this.app.send('down', 0.5);
		}, 200),
		forwards: _.throttle(function() {
			this.app.send('front', 0.1);
		}, 200),
		backwards: _.throttle(function() {
			this.app.send('back', 0.1);
		}, 200),
		left: _.throttle(function() {
			this.app.send('counterClockwise', 0.5);
		}, 200),
		right: _.throttle(function() {
			this.app.send('clockwise', 0.5);
		}, 200),
		stop: _.throttle(function() {
			var self = this;
			this.app.send('stop');
			setTimeout(function() {
				self.app.send('stop');
			}, 200);
			self.app.send('stop');
		}, 250)
	});

	return Controls;

});
