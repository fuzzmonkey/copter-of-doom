define('events', ['controls', 'pictures'], function(Controls, Pictures) {
	function Events(app) {
		this.app = app;
		this.controls = new Controls(app);
		this.pictures = new Pictures(app);

		this.events = {
//			'click #takeoff': 'takeoff',
//			'click #land': 'land',
			'keydown body': 'keyboard',
			'keyup body': 'stop'
		};

	}

	$.extend(Events.prototype, {
		start: function() {
			$('button').prop('disabled', false);
			this.bindEvents(this.events);
			this.controls.takePicture();
		},
		bindEvents: function(events) {
			var self = this;

			_.each(events, function(fn,target) {
				target = /^([^ ]+) (.*)/.exec(target);
				var ev = target[1];
				target = target[2];

				var _fn = self[fn];
				self[fn] = function() {
					_fn.apply(self, arguments);
				}

				$(target).on(ev, self[fn]);
			});
		},
	});

	$.extend(Events.prototype, {
		takeoff: function(ev) {
			this.controls.takeoff();
		},
		land: function() {
			this.controls.land();
		},
		keyboard: function(ev) {
			switch (ev.which) {
				case 65: // a
					this.controls.up();
					break;
				case 90: // z
					this.controls.down();
					break;
				case 38: // arrow up
					this.controls.forwards();
					break;
				case 40: // arrow down
					this.controls.backwards();
					break;
				case 37: // arrow left
					this.controls.left();
					break;
				case 39: // arrow right
					this.controls.right();
					break;
				case 13: // enter
					this.controls.takeoff();
					this.pictures.update();
					break;
				case 27: // escape
					this.controls.land();
					break;
			}
		},
		stop: function() {
			this.controls.stop();
		}
	});

	return Events;
});
